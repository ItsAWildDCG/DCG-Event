import express from 'express';
import cors from 'cors';
import { createAuthRouter } from './routes/auth.routes.js';
import { createEventsRouter } from './routes/events.routes.js';
import { requireAuth, requireAdmin } from './middleware/auth.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { getRepositories } from './repositories/index.js';
import { createAuthService } from './services/auth.service.js';
import { createEventsService } from './services/events.service.js';

export function createApp() {
  const app = express();
  const { authRepository, eventsRepository } = getRepositories();
  const authService = createAuthService(authRepository, eventsRepository);
  const eventsService = createEventsService(eventsRepository);

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', createAuthRouter(authService, requireAuth));
  app.use('/api/events', createEventsRouter(eventsService, requireAuth, requireAdmin));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
