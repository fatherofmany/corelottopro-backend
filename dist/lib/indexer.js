"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexFromBlock = indexFromBlock;
exports.handleLog = handleLog;
const ethers_1 = require("./ethers");
const prisma_1 = require("./prisma");
const Lottery_json_1 = __importDefault(require("../abi/Lottery.json"));
const CONFIRMATIONS = Number((_a = process.env.CONFIRMATIONS) !== null && _a !== void 0 ? _a : 3);
const START_BLOCK = Number((_b = process.env.START_BLOCK) !== null && _b !== void 0 ? _b : 0);
async function indexFromBlock(fromBlock) {
    var _a, _b, _c, _d, _e, _f;
    const provider = (0, ethers_1.getProvider)();
    const network = await provider.getNetwork();
    const latest = await provider.getBlockNumber();
    const toBlock = latest - CONFIRMATIONS;
    const contract = (0, ethers_1.getContract)(Lottery_json_1.default);
    // Example events — adjust to your ABI event names/args
    const filters = [
        (_b = (_a = contract.filters).EntryPurchased) === null || _b === void 0 ? void 0 : _b.call(_a),
        (_d = (_c = contract.filters).RoundClosed) === null || _d === void 0 ? void 0 : _d.call(_c),
        (_f = (_e = contract.filters).WinnersDrawn) === null || _f === void 0 ? void 0 : _f.call(_e),
    ].filter(Boolean);
    for (const f of filters) {
        const logs = await contract.queryFilter(f, fromBlock, toBlock);
        for (const log of logs) {
            await handleLog(log);
        }
    }
}
async function handleLog(log) {
    var _a, _b, _c, _d, _e, _f, _g;
    const { fragment } = log;
    const name = (fragment === null || fragment === void 0 ? void 0 : fragment.name) || 'Unknown';
    const args = (_a = log.args) !== null && _a !== void 0 ? _a : [];
    // Store generic event row
    await prisma_1.prisma.event.upsert({
        where: { txHash_logIndex: { txHash: log.transactionHash, logIndex: log.logIndex } },
        update: {},
        create: {
            name,
            txHash: log.transactionHash,
            blockNum: BigInt(log.blockNumber),
            logIndex: log.logIndex,
            data: JSON.parse(JSON.stringify(args))
        }
    });
    // Specific handlers (adjust to your ABI)
    if (name === 'EntryPurchased') {
        const [buyer, roundId, quantity, ticketPrice] = args;
        const wallet = await prisma_1.prisma.wallet.upsert({
            where: { address: buyer.toLowerCase() },
            update: {},
            create: { address: buyer.toLowerCase() }
        });
        const round = await prisma_1.prisma.round.upsert({
            where: { roundId: Number(roundId) },
            update: {},
            create: {
                roundId: Number(roundId),
                tier: 1,
                ticketPrice: (_c = (_b = ticketPrice === null || ticketPrice === void 0 ? void 0 : ticketPrice.toString) === null || _b === void 0 ? void 0 : _b.call(ticketPrice)) !== null && _c !== void 0 ? _c : '0'
            }
        });
        await prisma_1.prisma.entry.create({
            data: {
                roundId: round.id,
                walletId: wallet.id,
                quantity: Number(quantity),
                txHash: log.transactionHash,
                blockNum: BigInt(log.blockNumber),
                logIndex: log.logIndex
            }
        });
    }
    if (name === 'RoundClosed') {
        const [roundId, totalPool] = args;
        await prisma_1.prisma.round.updateMany({
            where: { roundId: Number(roundId) },
            data: {
                status: 'CLOSED',
                totalPool: (_e = (_d = totalPool === null || totalPool === void 0 ? void 0 : totalPool.toString) === null || _d === void 0 ? void 0 : _d.call(totalPool)) !== null && _e !== void 0 ? _e : '0'
            }
        });
    }
    if (name === 'WinnersDrawn') {
        const [roundId, winners, prizes] = args;
        const round = await prisma_1.prisma.round.findFirst({ where: { roundId: Number(roundId) } });
        if (!round)
            return;
        for (let i = 0; i < winners.length; i++) {
            const w = winners[i];
            const amount = prizes[i];
            const wallet = await prisma_1.prisma.wallet.upsert({
                where: { address: w.toLowerCase() },
                update: {},
                create: { address: w.toLowerCase() }
            });
            await prisma_1.prisma.prize.create({
                data: {
                    roundId: round.id,
                    place: i + 1,
                    amount: (_g = (_f = amount === null || amount === void 0 ? void 0 : amount.toString) === null || _f === void 0 ? void 0 : _f.call(amount)) !== null && _g !== void 0 ? _g : '0',
                    winnerId: wallet.id
                }
            });
        }
        await prisma_1.prisma.round.update({ where: { id: round.id }, data: { status: 'DRAWN' } });
    }
}
