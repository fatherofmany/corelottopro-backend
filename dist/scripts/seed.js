"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
async function main() {
    await prisma_js_1.prisma.round.create({
        data: {
            roundId: 1,
            tier: 1,
            ticketPrice: '0.1',
            status: 'OPEN'
        }
    });
    console.log('Seeded a sample round');
}
main().finally(() => prisma_js_1.prisma.$disconnect());
