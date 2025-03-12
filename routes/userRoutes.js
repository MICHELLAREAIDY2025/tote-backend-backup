const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
 
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
 
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });
 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
 
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({ msg: 'User registered successfully!', user: { id: newUser.id, name, email, role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
