import { FastifyInstance } from 'fastify';
import { loginHandler, whoamiHandler, logoutHandler } from '../controllers/authController'; // Ensure whoamiHandler is imported
import { db } from '../db/index'; // For direct db access in controller if not using service
import { users } from '../db/schema'; // For direct db access
import { eq } from 'drizzle-orm'; // For direct db access

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginHandler);
  fastify.get('/whoami', whoamiHandler); // Add the whoami route
  fastify.post('/logout', logoutHandler);
}

export default authRoutes;
