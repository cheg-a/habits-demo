import { FastifyRequest, FastifyReply } from "fastify";
import { getProfileSummary } from "../services/userService";
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // Для доступа к userId

export async function getProfileSummaryHandler(
  request: AuthenticatedRequest, // Используем AuthenticatedRequest для доступа к userId
  reply: FastifyReply
) {
  try {
    // Убедимся, что userId доступен из AuthenticatedRequest
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ message: "Пользователь не авторизован или ID пользователя отсутствует." });
    }

    const summary = await getProfileSummary(userId);
    if (!summary) {
      return reply.status(404).send({ message: "Данные профиля не найдены." });
    }
    reply.send(summary);
  } catch (error) {
    console.error("Ошибка при получении сводки профиля:", error);
    reply.status(500).send({ message: "Внутренняя ошибка сервера при получении сводки профиля." });
  }
}
