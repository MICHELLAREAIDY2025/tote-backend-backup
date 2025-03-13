const jwt = require('jsonwebtoken');

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
