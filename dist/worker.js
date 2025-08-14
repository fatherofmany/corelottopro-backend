"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const indexer_js_1 = require("./lib/indexer.js");
const ethers_js_1 = require("./lib/ethers.js");
async function main() {
    var _a;
    const provider = (0, ethers_js_1.getProvider)();
    const latest = await provider.getBlockNumber();
    const from = Number((_a = process.env.START_BLOCK) !== null && _a !== void 0 ? _a : Math.max(0, latest - 10000));
    console.log(`Starting backfill from block ${from}`);
    await (0, indexer_js_1.indexFromBlock)(from);
    // Poll new blocks
    provider.on('block', async (blockNum) => {
        var _a;
        const conf = Number((_a = process.env.CONFIRMATIONS) !== null && _a !== void 0 ? _a : 3);
        const target = Math.max(0, blockNum - conf);
        await (0, indexer_js_1.indexFromBlock)(target);
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
