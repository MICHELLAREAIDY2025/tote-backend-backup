const express = require('express');
const { login, register, logout, updateUser,getUserById, getMe } = require('../controllers/userController');
const { protect,authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update', protect, updateUser);  
router.get('/me', protect, getMe); 
router.get('/:id', protect, authorizeAdmin, getUserById);

module.exports = router;
