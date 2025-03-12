const express = require("express");
const { registerUser, loginUser, getUserById, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUserById);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
