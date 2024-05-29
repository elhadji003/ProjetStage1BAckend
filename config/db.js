const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
      
    }
};

module.exports = connectDB;
