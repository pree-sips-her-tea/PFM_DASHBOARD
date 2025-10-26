const { format, differenceInMilliseconds } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')
const { start } = require('repl')


const writeLog = (level, message, logFileName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
    const logItem = `[${dateTime}] [${level}] - ${message}`

    // On serverless platforms (like Vercel) the filesystem is read-only.
    // Prefer console logging there so logs surface in the platform's log stream.
    const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production'
    if (isServerless) {
        // Map level to console method
        if (level === 'error') console.error(logItem)
        else if (level === 'warn') console.warn(logItem)
        else console.log(logItem)
        return
    }

    // Local/dev: attempt to write to a logs directory. If that fails, fall back to console.
    try {
        const logDir = path.join(__dirname, '../logs')
        const logFile = path.join(logDir, logFileName)
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true })
        }
        fs.appendFileSync(logFile, logItem + '\n')
    } catch (error) {
        // If writing fails for any reason, fallback to console so service doesn't crash.
        if (level === 'error') console.error(error)
        else console.log(error)
        if (level === 'error') console.error(logItem)
        else console.log(logItem)
    }
}

const logger = (req, res, next) => {
    const method = req.method
    const url = req.url
    const origin = req.headers.origin
    const startTime = new Date()
    
    res.on('finish', () => {
        const statusCode = res.statusCode
        const elapsedTime = differenceInMilliseconds(new Date(), startTime)
        const message = `${method}\t${url}\t${origin}\t${statusCode}\t${elapsedTime}ms`

        const logLevel = process.env.LOG_LEVEL || 'info'
        if(logLevel === 'debug' || logLevel === 'info'){
            writeLog('info', message, 'requests.log')
        } else {
            writeLog(logLevel, message, `${logLevel}.log`)
        }
    })
    next()
}

module.exports = {
    writeLog,
    logger
}