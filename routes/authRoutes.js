const express = require("express");
const { registerUser, loginUser, getUserById, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/", registerUser);
router.post("/", loginUser);
router.get("/:id", getUserById);
router.post('/', forgotPassword);
router.post('/', resetPassword);


module.exports = router;
