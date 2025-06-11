import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import authRoutes from "./routes/authRoutes";
import questionnaireRoutes from "./routes/questionnaireRoutes"; // Import questionnaire routes
import reportRoutes from "./routes/reportRoutes"; // Import report routes
import userRoutes from "./routes/userRoutes"; // Import user routes
import { withAuth } from "./middleware/authMiddleware"; // Импортируем функцию для настройки авторизации
import * as dotenv from "dotenv";

dotenv.config(); // Load .env file

const sessionSettinsMap = new Map<string, any>()
  .set("development", { secure: false, sameSite: "lax" })
  .set("production", { secure: true, sameSite: "none" });
// Define a type for our session data
declare module "fastify" {
  interface Session {
    userId?: number;
  }
}

const buildApp = () => {
  const app = Fastify({
    logger: true, // Basic logging, can be configured further
  });

  app.register(fastifyCors, {
    origin: [
      "https://habit-mvp.up.railway.app",
      "https://cheg-a.github.io",
      "http://habbit.local:5173",
    ], // Allow requests from these origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Register cookie plugin
  app.register(fastifyCookie);

  // Register session plugin
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    app.log.error(
      "🔴 SESSION_SECRET is not set in environment variables. Application will not start.",
    );
    process.exit(1);
  }

  const sessionSettings = sessionSettinsMap.get(
    process.env.NODE_ENV || "development",
  );

  app.register(fastifySession, {
    secret: sessionSecret,
    cookieName: "sessionId", // Optional: customize session cookie name
    cookie: {
      // domain: "up.railway.app", // Убедитесь, что домен соответствует вашему приложению
      ...sessionSettings,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      path: "/", // Убедимся, что куки доступны для всех путей
    },
    // saveUninitialized: false,
  });

  // Применяем middleware для проверки авторизации
  withAuth(app);

  app.register(authRoutes, { prefix: "/auth" }); // Register auth routes under /auth prefix
  app.register(questionnaireRoutes, { prefix: "/questionnaire" }); // Register questionnaire routes
  app.register(reportRoutes, { prefix: "/reports" }); // Register report routes
  app.register(userRoutes, { prefix: "/api/user" }); // Префикс для пользовательских роутов

  // Placeholder for routes
  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error); // Log the error

    // For Zod validation errors, our controllers handle them.
    // This is a fallback for other errors.
    if (error.validation) {
      // This check is for Fastify's built-in validation, not Zod directly here
      // Zod errors are typically handled before this point by our specific parsing
      reply
        .status(400)
        .send({ message: "Validation Error", errors: error.validation });
      return;
    }

    // Send a generic error response
    // Check if the error has a statusCode, otherwise default to 500
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      message: error.message || "Internal Server Error",
      // Optionally, include error code or name if useful and safe
      // error: error.name
    });
  });

  return app;
};

export default buildApp;
