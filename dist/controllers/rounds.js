"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.byId = byId;
const prisma_1 = require("../lib/prisma");
async function list(_req, res) {
    var _a;
    try {
        const data = await prisma_1.prisma.round.findMany({
            orderBy: { roundId: 'desc' },
            include: { prizes: true, entries: true }
        });
        res.json(data);
    }
    catch (err) {
        console.error('Error in rounds.list:', err);
        res.status(500).json({ error: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Internal server error' });
    }
}
async function byId(req, res) {
    var _a;
    try {
        const idNum = Number(req.params.roundId);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ error: 'roundId must be a number' });
        }
        const data = await prisma_1.prisma.round.findFirst({
            where: { roundId: idNum },
            include: { prizes: true, entries: { include: { wallet: true } } }
        });
        if (!data) {
            return res.status(404).json({ error: 'Round not found' });
        }
        res.json(data);
    }
    catch (err) {
        console.error('Error in rounds.byId:', err);
        res.status(500).json({ error: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Internal server error' });
    }
}
