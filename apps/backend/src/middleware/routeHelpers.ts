import { FastifyInstance, RouteHandlerMethod } from 'fastify';
import { AuthRouteOptions } from './authMiddleware';

/**
 * Хелпер для более декларативного определения защищенных маршрутов
 */
export function registerProtectedRoute(
	fastify: FastifyInstance,
	method: 'get' | 'post' | 'put' | 'delete' | 'patch',
	url: string,
	handler: RouteHandlerMethod
) {
	fastify[method](url, {
		handler,
		config: { auth: true } as AuthRouteOptions
	});
}

/**
 * Хелпер для более декларативного определения публичных маршрутов
 */
export function registerPublicRoute(
	fastify: FastifyInstance,
	method: 'get' | 'post' | 'put' | 'delete' | 'patch',
	url: string,
	handler: RouteHandlerMethod
) {
	fastify[method](url, handler);
}
