import type { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const key = (req.headers['x-api-key'] as string | undefined) || (req.query.key as string | undefined);

  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({ error: 'ADMIN_API_KEY not configured' });
  }

  if (key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
