require('dotenv').config()
const express = require("express")
const cors = require('cors')
const cookies = require("cookie-parser")

const { logger } = require('./middlewares/logger.middleware')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const corsOptions = require('./config/corsOptions')

const connectDB = require("./config/connectDB")
const mongoose = require('mongoose')
const authRouter = require("./routes/auth.routes")
const adminRouter = require("./routes/admin.routes")
const transactionRouter = require("./routes/transaction.routes")
const budgetRouter = require("./routes/budget.routes")
const recurringTransaction = require("./routes/recurringTransaction.routes")

const app = express()

app.use(logger)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOptions))
app.use(cookies())

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/transactions', transactionRouter)
app.use('/budgets', budgetRouter)
app.use('/recurringTransactions', recurringTransaction)

// Health endpoint for quick runtime checks
app.get('/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
    const state = mongoose.connection ? mongoose.connection.readyState : 0
    let errorMsg = null
    if (mongoose.connection && mongoose.connection._hasError) {
        errorMsg = mongoose.connection._hasError.message || String(mongoose.connection._hasError)
    }
    res.status(state === 1 ? 200 : 500).json({
        status: state === 1 ? 'ok' : 'error',
        mongooseState: states[state] || 'unknown',
        error: errorMsg
    })
})

app.use(errorHandler)

// Connect to database
connectDB().then(() => {
    console.log('Database connected successfully')
}).catch(err => {
    console.error('Database connection error:', err)
})

// Only start the server if we're running locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
}

module.exports = app