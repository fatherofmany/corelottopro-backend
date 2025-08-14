import 'dotenv/config';
import { indexFromBlock } from './lib/indexer.js';
import { getProvider } from './lib/ethers.js';

async function main() {
  const provider = getProvider();
  const latest = await provider.getBlockNumber();
  const from = Number(process.env.START_BLOCK ?? Math.max(0, latest - 10_000));
  console.log(`Starting backfill from block ${from}`);
  await indexFromBlock(from);

  // Poll new blocks
  provider.on('block', async (blockNum) => {
    const conf = Number(process.env.CONFIRMATIONS ?? 3);
    const target = Math.max(0, blockNum - conf);
    await indexFromBlock(target);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});