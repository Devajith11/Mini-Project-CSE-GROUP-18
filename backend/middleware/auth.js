const jwt = require('jsonwebtoken');

// General auth - checks token is valid
const auth = (req, res, next) => {
    const token = req.header('x-auth-token') ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin only
const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    });
};

// Student only
const studentAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user && req.user.role === 'student') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }
    });
};

module.exports = { auth, adminAuth, studentAuth };