"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
function requireAdmin(req, res, next) {
    const key = req.headers['x-api-key'] || req.query.key;
    if (!process.env.ADMIN_API_KEY) {
        return res.status(500).json({ error: 'ADMIN_API_KEY not configured' });
    }
    if (key !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
