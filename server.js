const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');
const dotenv = require("dotenv").config();
const PORT = 8000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to handle request data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//create hotels
const hotelRoutes = require("./routes/post.routes");
app.use("/api/hotels", hotelRoutes);

//authentification 
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Serve static files (uploaded images)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start the server
app.listen(PORT, () => console.log("Server started on port " + PORT));
