const jwt = require("jsonwebtoken")
require('dotenv').config()

const { isBlacklisted } = require("../utils/blockToken.util")

const getUser = () => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token){
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "Missing JWT secret key" });
        }

        const blocked = await isBlacklisted(token)
        if (blocked) {
            return res.status(403).json({ message: 'token blocked' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = { userid: decoded.userid }

        next()
    } catch (error) {
        if(error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "token expired" })
        }
        return res.status(401).json({ message: "unauthorized" }) 
    }
}

module.exports = getUser