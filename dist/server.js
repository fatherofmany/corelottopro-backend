"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const lottery_1 = require("./routes/lottery");
const analytics_1 = require("./routes/analytics");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ status: 'Lottery Backend (TS) Running 🚀' });
});
app.use('/lottery', lottery_1.lotteryRouter);
app.use('/analytics', analytics_1.analyticsRouter);
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
