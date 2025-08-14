import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function top(_req: Request, res: Response) {
  try {
    // Sum quantities per wallet and order
    const top = await prisma.entry.groupBy({
      by: ['walletId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 50
    });

    const wallets = await prisma.wallet.findMany({
      where: { id: { in: top.map(t => t.walletId) } }
    });

    const joined = top.map(t => ({
      wallet: wallets.find(w => w.id === t.walletId),
      tickets: t._sum.quantity || 0
    }));

    res.json(joined);
  } catch (err: any) {
    console.error('Error in leaderboard.top:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}
