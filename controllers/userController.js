// Import required modules

const bcrypt = require('bcryptjs');// Library for hashing passwords
const User = require('../models/User');// Import the User model
const jwt = require('jsonwebtoken');// Library for handling JSON Web Tokens(JWT)
 

// Login function: Handles user authentication
exports.login = async (req, res) => {
    try {
        // Extract email and password from request body

        const { email, password } = req.body;
        
        // Check if a user with the given email exists in the database

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid email or password' });
        
        // Compare the entered password with the hashed password stored in the database

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });
 
        // Check if the JWT secret is defined in the .env file


        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT_SECRET is missing in .env file!" });
        }
         // Generate a JWT token with the user's ID and role, valid for the specified expiration time

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
         
        // Set the token in an HTTP-only cookie for security

        res.cookie('token', token, {
            httpOnly: true,  
            secure: false,   
            sameSite: 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // Respond with a success message and return some user details

        res.status(200).json({ 
            msg: 'Login successful', 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
            // Handle errors and send an error response

        res.status(500).json({ error: error.message });
    }
};

// Register function: Handles user registration

exports.register = async (req, res) => {
    try {
        // Extract user details from request body

        const { name, email, password, role, address } = req.body;

        // Check if a user with the given email already exists


        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        // Generate a salt and hash the password for security to add if statement and errror handling


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in the database


        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, // Store hashed password
            role: role || 'customer', // Default role is 'customer' if none is provided
            address: address || null  // Default address is null if not provided 
        });

        // Respond with a success message and return the new user's details


        res.status(201).json({ 
            msg: 'User registered successfully!', 
            user: { id: newUser.id, name, email, role: newUser.role, address: newUser.address } 
        });
    } catch (error) {
     // Handle errors and send an error response

        res.status(500).json({ error: error.message });
    }
};



