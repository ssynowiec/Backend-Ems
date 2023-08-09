import type { FastifyInstance } from 'fastify';
import {
	getUsersHandler,
	loginUserHandler,
	registerUserHandler,
} from './user.controller';
import { createUserSchema, loginSchema } from './user.schema.buckup';

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
			schema: createUserSchema,
		},
		registerUserHandler,
	);

	server.post(
		'/login',
		{
			schema: loginSchema,
		},
		loginUserHandler,
	);
};
