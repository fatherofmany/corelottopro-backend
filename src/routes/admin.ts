import { Router } from 'express';
import * as admin from '../controllers/admin.js';
import { requireAdmin } from '../lib/requireAdmin.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.post('/reindex', admin.reindexFrom);
adminRouter.post('/draw/:roundId', admin.drawRound); // optional: if using backend signer