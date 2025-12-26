const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const verifyToken = (req, res, next) => {
    // 1. FIRST try to get token from COOKIE (your loginController uses this)
    let token = req.cookies?.token;
    
    // 2. If not in cookie, try Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    
    // 3. If still no token, try query parameter (optional)
    if (!token && req.query.token) {
        token = req.query.token;
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user to request
        req.user = decoded;
        req.userId = decoded.id; // This matches { id: user._id } from loginController
        
        console.log('✅ Token verified for user:', decoded.email);
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token.'
        });
    }
};

module.exports = { verifyToken };