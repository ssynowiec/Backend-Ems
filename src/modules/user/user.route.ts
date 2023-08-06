import type { FastifyInstance } from 'fastify';
import {
	getUsersHandler,
	loginUserHandler,
	registerUserHandler,
} from './user.controller';
import { $ref } from './user.schema';

export const userRouter = async (server: FastifyInstance) => {
	server.get(
		'/',
		{
			preHandler: [server.authenticate],
		},
		getUsersHandler,
	);

	server.post(
		'/register',
		{
			schema: {
				body: $ref('createUserSchema'),
				response: {
					201: $ref('createUserResponseSchema'),
				},
			},
		},
		registerUserHandler,
	);

	server.post(
		'/login',
		{
			schema: {
				body: $ref('loginSchema'),
				response: {
					200: $ref('loginResponseSchema'),
				},
			},
		},
		loginUserHandler,
	);
};
