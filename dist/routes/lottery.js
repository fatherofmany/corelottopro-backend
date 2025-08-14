"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lotteryRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.lotteryRouter = (0, express_1.Router)();
// GET /lottery/rounds - fetch open rounds
exports.lotteryRouter.get('/rounds', async (_req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM rounds WHERE status = $1 ORDER BY id DESC', ['open']);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch rounds' });
    }
});
// POST /lottery/enter
exports.lotteryRouter.post('/enter', async (req, res) => {
    const { player, tier_id, amount } = req.body || {};
    if (!player || tier_id == null || amount == null) {
        return res.status(400).json({ error: 'Missing required fields: player, tier_id, amount' });
    }
    try {
        await db_1.pool.query('INSERT INTO entries (player, tier_id, amount) VALUES ($1, $2, $3)', [String(player), Number(tier_id), String(amount)]);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to enter round' });
    }
});
