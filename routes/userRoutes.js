const express = require('express');
const { login, register, logout, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update', protect, updateUser);  

module.exports = router;
