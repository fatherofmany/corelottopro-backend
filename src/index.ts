import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pinoHttp from 'pino-http';
import { router } from './routes/index'; // removed .js for TS compatibility

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(pinoHttp());

app.get('/health', (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.use('/api', router);

// Explicitly typed error handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err?.message || 'Unknown error',
  });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Lottery backend listening on http://localhost:${port}`);
});
