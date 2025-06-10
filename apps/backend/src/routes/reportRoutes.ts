import { FastifyInstance } from 'fastify';
import { saveDailyReportHandler } from '../controllers/reportController';

async function reportRoutes(fastify: FastifyInstance) {
  // All routes within this file will be prefixed with '/reports'
  // as defined in app.ts when registering these routes.

  // Route for POST /reports/daily
  fastify.post('/daily', saveDailyReportHandler);

  // Future routes for other report types (e.g., weekly) could be added here
  // fastify.post('/weekly', saveWeeklyReportHandler);
  // fastify.get('/summary', getReportsSummaryHandler);
}

export default reportRoutes;
