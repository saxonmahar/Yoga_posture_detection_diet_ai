const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = async () => {
   
    const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Database")
    } catch (error) {
        console.log("Error connecting to MongoDB Database" ,error)

    }
}

module.exports = connectDB