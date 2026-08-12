import { FastifyInstance } from 'fastify';
import { downloadController } from '../controllers/download.controller';

export async function downloadRoutes(fastify: FastifyInstance) {
  fastify.post('/api/download', downloadController);
}
