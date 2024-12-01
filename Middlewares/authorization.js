const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user info to the request

            // Check if the user's role is allowed
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied.' });
            }

            next(); // Proceed to the next middleware
        } catch (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
    };
};

module.exports = authorize;
