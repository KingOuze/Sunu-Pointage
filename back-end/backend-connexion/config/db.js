const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    console.log('MongoDB URI:', process.env.MONGO_URI); // Debugging
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;