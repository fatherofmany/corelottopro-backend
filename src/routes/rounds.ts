import { Router } from 'express';
import * as rounds from '../controllers/rounds.js';
export const roundsRouter = Router();

roundsRouter.get('/', rounds.list);
roundsRouter.get('/:roundId', rounds.byId);