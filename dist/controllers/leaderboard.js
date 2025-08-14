"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.top = top;
const prisma_1 = require("../lib/prisma");
async function top(_req, res) {
    var _a;
    try {
        // Sum quantities per wallet and order
        const top = await prisma_1.prisma.entry.groupBy({
            by: ['walletId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 50
        });
        const wallets = await prisma_1.prisma.wallet.findMany({
            where: { id: { in: top.map(t => t.walletId) } }
        });
        const joined = top.map(t => ({
            wallet: wallets.find(w => w.id === t.walletId),
            tickets: t._sum.quantity || 0
        }));
        res.json(joined);
    }
    catch (err) {
        console.error('Error in leaderboard.top:', err);
        res.status(500).json({ error: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Internal server error' });
    }
}
