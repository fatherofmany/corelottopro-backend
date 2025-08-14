"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const pino_http_1 = __importDefault(require("pino-http"));
const index_1 = require("./routes/index"); // removed .js for TS compatibility
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use((0, cors_1.default)({ origin: corsOrigin, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, pino_http_1.default)());
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api', index_1.router);
// Explicitly typed error handler
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
    });
};
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Lottery backend listening on http://localhost:${port}`);
});
