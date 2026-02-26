/**
 * Instance Usage for helmet
 * Tests detection
 */

import helmet from 'helmet';
import express from 'express';

class SecurityMiddleware {
  setupHelmet(app: express.Application) {
    // ⚠️ No CSP configuration
    app.use(helmet());
  }
  
  disableSecurity(app: express.Application) {
    // ⚠️ CSP disabled
    app.use(helmet({ contentSecurityPolicy: false }));
  }
}

const app = express();
app.use(helmet()); // ⚠️ Default config

export { SecurityMiddleware, app };
