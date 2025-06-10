import { FastifyInstance } from "fastify";
import {
  loginHandler,
  whoamiHandler,
  logoutHandler,
  updatePasswordHandler,
} from "../controllers/authController";
import { AuthRouteOptions } from "../middleware/authMiddleware";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", loginHandler);

  // Маршрут с проверкой авторизации
  fastify.get("/whoami", {
    handler: whoamiHandler,
    config: { auth: true } as AuthRouteOptions,
  });

  // Маршрут с проверкой авторизации
  fastify.post("/logout", {
    handler: logoutHandler,
    config: { auth: true } as AuthRouteOptions,
  });

  // Маршрут для обновления пароля
  fastify.post("/update-password", {
    handler: updatePasswordHandler,
    config: { auth: true } as AuthRouteOptions,
  });
}

export default authRoutes;
