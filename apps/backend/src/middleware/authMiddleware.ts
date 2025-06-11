import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

// Define UserPayload and AuthenticatedRequest
export interface UserPayload {
  id: number; // Changed to number to match schema users.id
  // Можно добавить другие поля пользователя, если они нужны в request.user
}

export interface AuthenticatedRequest extends FastifyRequest {
  user?: UserPayload;
  session: {
    userId?: number; // Changed to number to match UserPayload.id and schema users.id
    [key: string]: any; // Для других возможных полей сессии
  };
}

// Middleware для проверки авторизации и добавления user к request
export const requireAuth = async (request: AuthenticatedRequest, reply: FastifyReply) => {
	if (!request.session.userId) {
		return reply.status(401).send({ message: 'Unauthorized: No active session' });
	}
  // Добавляем объект user в request
  // Ensure that request.session.userId is treated as a number if it is.
  // If it's stored as a string in session for some reason, it might need parseFloat/parseInt.
  // However, based on Fastify.Session interface, it should be number.
  request.user = { id: request.session.userId };
};

// Тип для опций маршрутов с флагом авторизации
export interface AuthRouteOptions {
	auth?: boolean;
}

// Функция-хелпер для добавления middleware проверки авторизации к маршрутам
export const withAuth = (fastify: FastifyInstance) => {
	// Регистрируем hook onRoute для перехвата регистрации всех маршрутов
	fastify.addHook('onRoute', (routeOptions) => {
		// Проверяем наличие конфигурации и флага auth
		const config = routeOptions.config as Record<string, any> | undefined;
		const requiresAuth = config?.auth === true;

		// Если маршрут требует авторизации, добавляем middleware
		if (requiresAuth) {
			// Обеспечиваем что preHandler существует и является массивом
			const preHandler = routeOptions.preHandler
				? Array.isArray(routeOptions.preHandler)
					? [...routeOptions.preHandler, requireAuth]
					: [routeOptions.preHandler, requireAuth]
				: requireAuth;

			routeOptions.preHandler = preHandler;
		}
	});

	return fastify;
};
