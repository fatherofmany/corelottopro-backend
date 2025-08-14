import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function summary(_req: Request, res: Response) {
  try {
    const [rounds, entries, wallets] = await Promise.all([
      prisma.round.count(),
      prisma.entry.count(),
      prisma.wallet.count()
    ]);

    const poolAgg = await prisma.round.aggregate({
      _sum: { totalPool: true }
    });

    res.json({
      rounds,
      entries,
      wallets,
      totalPool: poolAgg._sum.totalPool ?? 0
    });
  } catch (err: any) {
    console.error('Error in summary:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}
