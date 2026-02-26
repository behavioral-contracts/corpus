/**
 * Instance Usage for cors
 */

import cors from 'cors';
import express from 'express';

class CorsMiddleware {
  setup(app: express.Application) {
    // ⚠️ Wildcard origin
    app.use(cors({ origin: '*' }));
  }
}

const app = express();
app.use(cors()); // ⚠️ Default (permissive)

export { CorsMiddleware, app };
