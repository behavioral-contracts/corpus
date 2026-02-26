/**
 * Proper CORS Configuration
 * Should produce 0 violations
 */

import cors from 'cors';
import express from 'express';

const app = express();

// ✅ Explicit origin configuration
app.use(cors({
  origin: ['https://example.com', 'https://api.example.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// ✅ Dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://example.com'];
    if (\!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

export { app };
