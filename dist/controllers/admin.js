"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reindexFrom = reindexFrom;
exports.drawRound = drawRound;
const indexer_1 = require("../lib/indexer");
const ethers_1 = require("../lib/ethers");
async function reindexFrom(req, res) {
    var _a, _b, _c;
    try {
        const start = Number((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.startBlock) !== null && _b !== void 0 ? _b : 0);
        await (0, indexer_1.indexFromBlock)(start);
        res.json({ ok: true, startedAtBlock: start });
    }
    catch (err) {
        console.error('Error in reindexFrom:', err);
        res.status(500).json({ error: (_c = err === null || err === void 0 ? void 0 : err.message) !== null && _c !== void 0 ? _c : 'Internal server error' });
    }
}
// OPTIONAL draw call — only if your contract exposes drawWinners and you set ADMIN_PRIVATE_KEY
async function drawRound(req, res) {
    var _a;
    try {
        const roundId = Number(req.params.roundId);
        if (Number.isNaN(roundId)) {
            return res.status(400).json({ error: 'roundId must be a number' });
        }
        const signer = (0, ethers_1.getSigner)();
        if (!signer) {
            return res.status(400).json({ error: 'Backend signer not configured' });
        }
        // TODO: import ABI and call contract drawWinners(roundId)
        res.json({ ok: false, message: 'Implement contract call here once ABI is wired.' });
    }
    catch (err) {
        console.error('Error in drawRound:', err);
        res.status(500).json({ error: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Internal server error' });
    }
}
