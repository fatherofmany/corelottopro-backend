import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { lotteryRouter } from './routes/lottery';
import { analyticsRouter } from './routes/analytics';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'Lottery Backend (TS) Running 🚀' });
});

app.use('/lottery', lotteryRouter);
app.use('/analytics', analyticsRouter);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
