"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    // eslint-disable-next-line no-console
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
}
exports.pool = new pg_1.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});
