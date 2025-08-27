const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const cookieToken = req.cookies && req.cookies.token;
    const jwtToken = token || cookieToken;
    if (!jwtToken) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payload; // { id, role }
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authenticate, requireRole };

