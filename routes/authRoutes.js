const express = require('express');
const { registerUser, loginUser, getUserById, forgotPassword, resetPassword, getUsers, logOut, getProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, registerUser);
router.post('/', auth, loginUser);
router.get('/:id', auth, getUserById);
router.get('/', auth, getUsers);
router.post('/', auth, forgotPassword);
router.post('/', auth, resetPassword);
router.get('/', auth, logOut)
router.get('/', auth, getProfile)

module.exports = router;
