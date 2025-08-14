import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { indexFromBlock } from '../lib/indexer';
import { getSigner } from '../lib/ethers';

export async function reindexFrom(req: Request, res: Response) {
  try {
    const start = Number(req.body?.startBlock ?? 0);
    await indexFromBlock(start);
    res.json({ ok: true, startedAtBlock: start });
  } catch (err: any) {
    console.error('Error in reindexFrom:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}

// OPTIONAL draw call — only if your contract exposes drawWinners and you set ADMIN_PRIVATE_KEY
export async function drawRound(req: Request, res: Response) {
  try {
    const roundId = Number(req.params.roundId);
    if (Number.isNaN(roundId)) {
      return res.status(400).json({ error: 'roundId must be a number' });
    }

    const signer = getSigner();
    if (!signer) {
      return res.status(400).json({ error: 'Backend signer not configured' });
    }

    // TODO: import ABI and call contract drawWinners(roundId)
    res.json({ ok: false, message: 'Implement contract call here once ABI is wired.' });
  } catch (err: any) {
    console.error('Error in drawRound:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}
