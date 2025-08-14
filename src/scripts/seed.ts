import { prisma } from '../lib/prisma.js';

async function main() {
  await prisma.round.create({
    data: {
      roundId: 1,
      tier: 1,
      ticketPrice: '0.1',
      status: 'OPEN'
    }
  });
  console.log('Seeded a sample round');
}

main().finally(() => prisma.$disconnect());