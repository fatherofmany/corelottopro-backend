# CITE Lottery Backend (Express + Prisma + Ethers)

A production-ready starter backend for your Core DAO lottery dApp.

## What you get
- TypeScript + Express API (`/api/*`)
- PostgreSQL via Prisma (with Docker Compose)
- On-chain **indexer worker** (ethers v6) to ingest contract events
- Simple admin auth via `x-api-key`
- Clean data models for rounds, entries, prizes, wallets

## Quickstart
```bash
# 1) Start Postgres
docker compose up -d

# 2) Configure env
cp .env.example .env
# Edit .env (RPC, CONTRACT_ADDRESS, ADMIN_API_KEY, START_BLOCK)

# 3) Install deps
pnpm i  # or npm i / yarn

# 4) Prisma
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:seed

# 5) Run server
pnpm dev  # http://localhost:4000/health

# 6) Run indexer worker in another terminal
pnpm worker
```

## API
- `GET /health`
- `GET /api/rounds` — list rounds with entries & prizes
- `GET /api/rounds/:roundId` — details
- `GET /api/leaderboard` — top wallets by tickets
- `GET /api/analytics/summary` — totals

### Admin (requires `x-api-key`)
- `POST /api/admin/reindex` — `{ startBlock: number }`
- `POST /api/admin/draw/:roundId` — placeholder to call contract once ABI + signer are provided

## Wire to your frontend
Update your frontend API calls to read from this server for analytics, leaderboard, and round history instead of pulling everything from chain at runtime. The worker keeps the DB in sync via events.

## IMPORTANT
- Replace `src/abi/Lottery.json` with your **real ABI** (your React project already has it).
- Set `CORE_RPC_URL`, `CHAIN_ID`, `CONTRACT_ADDRESS`, and `START_BLOCK` in `.env`.
- If you don't want writes from backend, **omit** `ADMIN_PRIVATE_KEY` and keep admin endpoints read-only or disabled.