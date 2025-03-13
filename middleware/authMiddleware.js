// Import the jsonwebtoken library for handling JWT authentication

/*const jwt = require('jsonwebtoken');

// Middleware function to protect routes by verifying JWT tokens

exports.protect = (req, res, next) => {
    
    // Extract the token from the Authorization header

    const token = req.header('Authorization');
        
    // If no token is provided, return a 401 Unauthorized response

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Remove 'Bearer ' prefix from the token (if present) and verify it using the JWT secret

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        // Attach the decoded user information to the request object for use in protected routes

        req.user = decoded; // Add user data to request
        
        // Move to the next middleware or route handler

        next();
    } catch (error) {

        // If the token is invalid or expired, return a 401 Unauthorized response

        res.status(401).json({ msg: 'Invalid token' });
    }
};*/

// Import the jsonwebtoken library for handling JWT authentication
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model to check admin status

// Middleware function to protect routes by verifying JWT tokens
exports.protect = (req, res, next) => {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, no token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware function to authorize admin users
exports.authorizeAdmin = async (req, res, next) => {
    try {
        // Check if req.user exists (protect middleware should run first)
        if (!req.user) {
            return res.status(401).json({ msg: 'Not authenticated' });
        }

        // Optional: Fetch the complete user data from database to verify role
        // This is useful if the token doesn't contain the role information
        const user = await User.findByPk(req.user.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the user has admin role
        // Adjust this condition based on how you store admin status in your user model
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized as admin' });
        }

        // If user is admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        res.status(500).json({ msg: 'Server error during authorization' });
    }
};

// If you need a simpler admin check without database query
// (Use this if your JWT token already contains the role information)
exports.authorizeAdminSimple = (req, res, next) => {
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized as admin' });
    }
    
    // If user is admin, proceed
    next();
};