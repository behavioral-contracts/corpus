/**
 * Proper Usage for helmet
 * Should produce 0 violations
 */

import helmet from 'helmet';
import express from 'express';

const app = express();

// ✅ Apply helmet early in middleware chain
app.use(helmet());

// ✅ Configure CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}));

// ✅ Helmet with custom options
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

export { app };
