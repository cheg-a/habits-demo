import { FastifyInstance } from "fastify";
import { getProfileSummaryHandler } from "../controllers/userController";
import { registerProtectedRoute } from "../middleware/routeHelpers";

async function userRoutes(fastify: FastifyInstance) {
  // GET /api/profile-summary - защищенный роут для получения сводки профиля
  registerProtectedRoute(fastify, "get", "/profile-summary", getProfileSummaryHandler);
}

export default userRoutes;
