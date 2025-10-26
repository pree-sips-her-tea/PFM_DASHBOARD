const mongoose = require('mongoose')
require('dotenv').config()

/**
 * Connect to MongoDB.
 * Priority:
 * 1. Use full connection string in process.env.DB_CONNECTION (recommended for production / Vercel env)
 * 2. Fall back to individual components: DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
 */
async function dbConnect(){
    const envConnection = process.env.DB_CONNECTION

    const connectionString = envConnection || (() => {
        const user = encodeURIComponent(process.env.DB_USER || '')
        const password = encodeURIComponent(process.env.DB_PASSWORD || '')
        const host = process.env.DB_HOST || ''
        const dbname = process.env.DB_NAME || ''
        // include safe defaults for options
        return `mongodb+srv://${user}:${password}@${host}/${dbname}?retryWrites=true&w=majority`
    })()

    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Connected.")
    } catch (error) {
        console.error("Database error:", error)
        // rethrow so deployment logs show failure and caller can handle it
        throw error
    }
}

module.exports = dbConnect