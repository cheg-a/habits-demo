import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

// Middleware для проверки авторизации
export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
	if (!request.session.userId) {
		return reply.status(401).send({ message: 'Unauthorized: No active session' });
	}
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
