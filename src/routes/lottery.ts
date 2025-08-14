import { Router } from 'express';
import { pool } from '../db';

export const lotteryRouter = Router();

// GET /lottery/rounds - fetch open rounds
lotteryRouter.get('/rounds', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rounds WHERE status = $1 ORDER BY id DESC', ['open']);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch rounds' });
  }
});

// POST /lottery/enter
lotteryRouter.post('/enter', async (req, res) => {
  const { player, tier_id, amount } = req.body || {};
  if (!player || tier_id == null || amount == null) {
    return res.status(400).json({ error: 'Missing required fields: player, tier_id, amount' });
  }
  try {
    await pool.query(
      'INSERT INTO entries (player, tier_id, amount) VALUES ($1, $2, $3)',
      [String(player), Number(tier_id), String(amount)]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to enter round' });
  }
});
