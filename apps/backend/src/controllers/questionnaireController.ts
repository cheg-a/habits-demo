import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';
import { questionnaires } from '../db/schema';
import { z } from 'zod'; // Corrected import

// Optional: Define a schema for request body validation
const questionnaireBodySchema = z.object({
  // Define expected structure of answers.
  // This is a placeholder; adjust based on actual questionnaire structure.
  // For example, if answers is an object of key-value pairs:
  // answers: z.record(z.any()),
  // Or if it's an array of strings:
  // answers: z.array(z.string()),
  // For this generic example, let's assume it can be any JSON-compatible structure.
  answers: z.any(),
});

export const saveQuestionnaireHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.session.userId) {
      return reply.status(401).send({ message: 'Unauthorized: User not logged in.' });
    }

    const userId = request.session.userId;

    // Validate request body
    // For simplicity, we're directly using request.body as 'answers'.
    // In a real application, you'd parse and validate this more thoroughly.
    // For example, using the questionnaireBodySchema:
    /*
    const parsedBody = questionnaireBodySchema.safeParse({ answers: request.body });
    if (!parsedBody.success) {
      return reply.status(400).send({ message: 'Invalid questionnaire data', errors: parsedBody.error.flatten() });
    }
    const { answers } = parsedBody.data;
    */

    // Assuming request.body directly contains the answers object/array
    const answers = request.body;

    if (!answers || (typeof answers === 'object' && Object.keys(answers).length === 0) || (Array.isArray(answers) && answers.length === 0)) {
      return reply.status(400).send({ message: 'Bad Request: Answers data is missing or empty.' });
    }

    const [savedQuestionnaire] = await db
      .insert(questionnaires)
      .values({
        userId,
        answers, // Directly using the validated (or assumed valid) request.body
      })
      .returning();

    return reply.status(201).send(savedQuestionnaire);

  } catch (error) {
    request.log.error(error, 'Error saving questionnaire');
    // Check for specific database errors if needed, e.g., foreign key violation
    return reply.status(500).send({ message: 'Internal Server Error while saving questionnaire.' });
  }
};
