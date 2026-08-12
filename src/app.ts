import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { healthRoutes } from './routes/health.routes';
import { downloadRoutes } from './routes/download.routes';
import { env } from './config/env';
import path from 'path';
import fs from 'fs';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // CORS
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Rate limiting'
  await app.register(rateLimit, {
    max: parseInt(env.RATE_LIMIT_MAX),
    timeWindow: parseInt(env.RATE_LIMIT_WINDOW),
  });

  // Security headers
  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (env.NODE_ENV === 'production') {
      reply.header(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      );
    }

    return payload;
  });

  // Register routes
  await healthRoutes(app);
  await downloadRoutes(app);

  // Serve static files
  await app.register(require('@fastify/static'), {
    root: path.join(process.cwd(), 'public'),
    prefix: '/',
  });

  // Serve index.html for root route
  app.get('/', async (_request, reply) => {
    return reply.type('text/html').send(fs.readFileSync(path.join(process.cwd(), 'public', 'index.html'), 'utf8'));
  });

  return app;
}
