const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected✅✅ :", connectionInstance.connection.host, connectionInstance.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed❌:", error.message);
    }
}

module.exports = connectDB;