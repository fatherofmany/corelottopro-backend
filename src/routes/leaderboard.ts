import { Router } from 'express';
import * as leaderboard from '../controllers/leaderboard.js';
export const leaderboardRouter = Router();

leaderboardRouter.get('/', leaderboard.top);