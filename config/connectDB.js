const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // The MongoDB Node.js driver >=4 and Mongoose >=6 no longer require
        // `useNewUrlParser` or `useUnifiedTopology` options; they are deprecated.
        // Provide a short serverSelectionTimeout to fail fast in serverless envs.
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
