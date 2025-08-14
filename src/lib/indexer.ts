import { getContract, getProvider } from './ethers';
import { prisma } from './prisma';
import LotteryABI from '../abi/Lottery.json';

import type { Log } from 'ethers';

const CONFIRMATIONS = Number(process.env.CONFIRMATIONS ?? 3);
const START_BLOCK = Number(process.env.START_BLOCK ?? 0);

export async function indexFromBlock(fromBlock: number): Promise<void> {
  const provider = getProvider();
  const network = await provider.getNetwork();
  const latest = await provider.getBlockNumber();
  const toBlock = latest - CONFIRMATIONS;
  const contract = getContract(LotteryABI);

  // Example events — adjust to your ABI event names/args
  const filters = [
    contract.filters.EntryPurchased?.(),
    contract.filters.RoundClosed?.(),
    contract.filters.WinnersDrawn?.(),
  ].filter(Boolean);

  for (const f of filters) {
    const logs = await contract.queryFilter(f as any, fromBlock, toBlock);
    for (const log of logs) {
      await handleLog(log);
    }
  }
}

export async function handleLog(log: any): Promise<void> {
  const { fragment } = log;
  const name: string = fragment?.name || 'Unknown';
  const args = log.args ?? [];

  // Store generic event row
  await prisma.event.upsert({
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
    const [buyer, roundId, quantity, ticketPrice] = args as [string, number, number, any];
    const wallet = await prisma.wallet.upsert({
      where: { address: buyer.toLowerCase() },
      update: {},
      create: { address: buyer.toLowerCase() }
    });
    const round = await prisma.round.upsert({
      where: { roundId: Number(roundId) },
      update: {},
      create: {
        roundId: Number(roundId),
        tier: 1,
        ticketPrice: ticketPrice?.toString?.() ?? '0'
      }
    });
    await prisma.entry.create({
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
    const [roundId, totalPool] = args as [number, any];
    await prisma.round.updateMany({
      where: { roundId: Number(roundId) },
      data: {
        status: 'CLOSED',
        totalPool: totalPool?.toString?.() ?? '0'
      }
    });
  }

  if (name === 'WinnersDrawn') {
    const [roundId, winners, prizes] = args as [number, string[], any[]];
    const round = await prisma.round.findFirst({ where: { roundId: Number(roundId) } });
    if (!round) return;
    for (let i = 0; i < winners.length; i++) {
      const w = winners[i];
      const amount = prizes[i];
      const wallet = await prisma.wallet.upsert({
        where: { address: w.toLowerCase() },
        update: {},
        create: { address: w.toLowerCase() }
      });
      await prisma.prize.create({
        data: {
          roundId: round.id,
          place: i + 1,
          amount: amount?.toString?.() ?? '0',
          winnerId: wallet.id
        }
      });
    }
    await prisma.round.update({ where: { id: round.id }, data: { status: 'DRAWN' } });
  }
}
