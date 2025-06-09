import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { z } from 'zod';
// Imports for direct DB access if not using service fully (db, users, eq)
// These should be removed if AuthService.findUserById is used exclusively
import { db } from '../db/index';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';


const authService = new AuthService();


const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedBody = loginSchema.safeParse(request.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parsedBody.error.flatten().fieldErrors });
    }

    const { username, password } = parsedBody.data;
    const user = await authService.verifyUser(username, password);

    if (!user) {
      return reply.status(401).send({ message: 'Invalid username or password' });
    }

    request.session.userId = user.id;
    const { passwordHash, ...userResponse } = user;
    return reply.send({ message: 'Login successful', user: { ...userResponse, needQuestionnaire: false } });

  } catch (error) {
    request.log.error(error, 'Login handler error');
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
};

export const whoamiHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.session.userId) {
      return reply.status(401).send({ message: 'Unauthorized: No active session' });
    }

    const userId = request.session.userId;
    const user = await authService.findUserById(userId); // Using the service method

    if (!user) {
      request.log.warn(`User with ID ${userId} from session not found in DB`);
      request.session.destroy((err) => {
        if (err) {
          request.log.error(err, 'Session destruction failed during whoami');
        }
      });
      return reply.status(404).send({ message: 'User not found, session cleared' });
    }

    return reply.send(user);

  } catch (error) {
    request.log.error(error, 'Whoami handler error');
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
};
