import { FastifyInstance } from 'fastify';
import { saveQuestionnaireHandler } from '../controllers/questionnaireController';

async function questionnaireRoutes(fastify: FastifyInstance) {
  // All routes within this file will be prefixed with '/questionnaire'
  // as defined in app.ts when registering these routes.

  // Route for POST /questionnaire/
  fastify.post('/', saveQuestionnaireHandler);
}

export default questionnaireRoutes;
