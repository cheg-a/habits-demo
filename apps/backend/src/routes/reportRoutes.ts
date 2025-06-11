import { FastifyInstance } from 'fastify';
import { saveDailyReportHandler, getMonthlyDailyReportsHandler } from '../controllers/reportController';
import { registerProtectedRoute } from '../middleware/routeHelpers';

async function reportRoutes(fastify: FastifyInstance) {
  // All routes within this file will be prefixed with '/reports'
  // as defined in app.ts when registering these routes.

  // Route for POST /reports/daily (требует авторизации)
  registerProtectedRoute(fastify, 'post', '/daily', saveDailyReportHandler);

  // Route for GET /reports/daily/monthly?month=MM&year=YYYY (требует авторизации)
  registerProtectedRoute(fastify, 'get', '/daily/monthly', getMonthlyDailyReportsHandler as unknown as import('fastify').RouteHandlerMethod);

  // Future routes for other report types (e.g., weekly) could be added here
  // registerProtectedRoute(fastify, 'post', '/weekly', saveWeeklyReportHandler);
  // registerProtectedRoute(fastify, 'get', '/summary', getReportsSummaryHandler);
}

export default reportRoutes;
