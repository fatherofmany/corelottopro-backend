import { Router } from 'express';
import { roundsRouter } from './rounds';
import { analyticsRouter } from './analytics';
import { leaderboardRouter } from './leaderboard';
import { adminRouter } from './admin';

export const router = Router();

router.use('/rounds', roundsRouter);
router.use('/analytics', analyticsRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/admin', adminRouter);
