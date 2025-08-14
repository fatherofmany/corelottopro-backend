"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.analyticsRouter = (0, express_1.Router)();
exports.analyticsRouter.get('/', async (_req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        const totalRoundsQ = await db_1.pool.query('SELECT COUNT(*)::int AS count FROM rounds');
        const totalPlayersQ = await db_1.pool.query('SELECT COUNT(DISTINCT player)::int AS count FROM entries');
        const totalVolumeQ = await db_1.pool.query('SELECT COALESCE(SUM(amount), 0)::text AS sum FROM entries');
        res.json({
            totalRounds: (_b = (_a = totalRoundsQ.rows[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0,
            totalPlayers: (_d = (_c = totalPlayersQ.rows[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0,
            totalVolume: (_f = (_e = totalVolumeQ.rows[0]) === null || _e === void 0 ? void 0 : _e.sum) !== null && _f !== void 0 ? _f : '0'
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
    }
});
