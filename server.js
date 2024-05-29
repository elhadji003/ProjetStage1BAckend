const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');
const dotenv = require("dotenv").config();
const hotelRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/authRoutes");
const postImage = require("./routes/postImage");
const path = require("path");

const PORT = 8000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to handle request data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes);

// Serve static files (uploaded images)
app.use("/uploads", postImage, express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => console.log("Server started on port " + PORT));
