/**
 * Missing CORS Configuration
 * Should produce WARNING violations
 */

import cors from 'cors';
import express from 'express';

const app = express();

// ⚠️ Wildcard origin with credentials (insecure)
app.use(cors({
  origin: '*',
  credentials: true // Invalid combination\!
}));

// ⚠️ Default CORS (too permissive)
app.use(cors());

// ⚠️ Wildcard in production
app.use(cors({ origin: '*' }));

export { app };
