import { Router } from 'express';
import { pool } from '../db';

export const analyticsRouter = Router();

analyticsRouter.get('/', async (_req, res) => {
  try {
    const totalRoundsQ = await pool.query('SELECT COUNT(*)::int AS count FROM rounds');
    const totalPlayersQ = await pool.query('SELECT COUNT(DISTINCT player)::int AS count FROM entries');
    const totalVolumeQ = await pool.query('SELECT COALESCE(SUM(amount), 0)::text AS sum FROM entries');

    res.json({
      totalRounds: totalRoundsQ.rows[0]?.count ?? 0,
      totalPlayers: totalPlayersQ.rows[0]?.count ?? 0,
      totalVolume: totalVolumeQ.rows[0]?.sum ?? '0'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
  }
});
