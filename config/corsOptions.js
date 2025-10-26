require('dotenv').config()

// Parse ALLOWED_ORIGINS safely. Expect a comma-separated list, e.g.:
// ALLOWED_ORIGINS=https://example.com,https://frontend.example.com,https://your-frontend.vercel.app
const rawAllowed = process.env.ALLOWED_ORIGINS || ''
const allowedOrigins = rawAllowed
    .split(',')
    .map(s => s.trim())
    .filter(Boolean) // remove empty entries

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (like curl, server-to-server requests)
        if (!origin) return callback(null, true)

        // if wildcard is present, allow all origins
        if (allowedOrigins.includes('*')) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('CORS not allowed'))
    },
    credentials: true,
    optionsSuccessStatus: 200,
}

module.exports = corsOptions