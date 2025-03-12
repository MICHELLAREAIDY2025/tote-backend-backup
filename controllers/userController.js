const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
 


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });
 
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT_SECRET is missing in .env file!" });
        }
 
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
 
        res.cookie('token', token, {
            httpOnly: true,  
            secure: false,   
            sameSite: 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ 
            msg: 'Login successful', 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

