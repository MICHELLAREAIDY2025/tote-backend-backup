// Import the jsonwebtoken library for handling JWT authentication

const jwt = require('jsonwebtoken');

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
};
