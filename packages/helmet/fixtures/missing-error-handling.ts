/**
 * Missing Configuration for helmet
 * Should produce WARNING violations
 */

import helmet from 'helmet';
import express from 'express';

const app = express();

// ⚠️ Default helmet without CSP configuration
app.use(helmet());

// ⚠️ Applied too late (after other middleware)
app.get('/api/data', (req, res) => {
  res.json({ data: 'value' });
});

app.use(helmet()); // ⚠️ Should be earlier

// ⚠️ No CSP configured (default may be too permissive)
app.use(helmet({
  contentSecurityPolicy: false // Disables CSP
}));

export { app };
