import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function list(_req: Request, res: Response) {
  try {
    const data = await prisma.round.findMany({
      orderBy: { roundId: 'desc' },
      include: { prizes: true, entries: true }
    });
    res.json(data);
  } catch (err: any) {
    console.error('Error in rounds.list:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}

export async function byId(req: Request, res: Response) {
  try {
    const idNum = Number(req.params.roundId);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: 'roundId must be a number' });
    }

    const data = await prisma.round.findFirst({
      where: { roundId: idNum },
      include: { prizes: true, entries: { include: { wallet: true } } }
    });

    if (!data) {
      return res.status(404).json({ error: 'Round not found' });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Error in rounds.byId:', err);
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}
