"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summary = summary;
const prisma_1 = require("../lib/prisma");
async function summary(_req, res) {
    var _a, _b;
    try {
        const [rounds, entries, wallets] = await Promise.all([
            prisma_1.prisma.round.count(),
            prisma_1.prisma.entry.count(),
            prisma_1.prisma.wallet.count()
        ]);
        const poolAgg = await prisma_1.prisma.round.aggregate({
            _sum: { totalPool: true }
        });
        res.json({
            rounds,
            entries,
            wallets,
            totalPool: (_a = poolAgg._sum.totalPool) !== null && _a !== void 0 ? _a : 0
        });
    }
    catch (err) {
        console.error('Error in summary:', err);
        res.status(500).json({ error: (_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : 'Internal server error' });
    }
}
