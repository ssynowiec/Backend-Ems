import type { FastifyInstance } from 'fastify';
import { getUsersHandler, registerUserHandler } from './user.controller';
import {
	createUserResponseSchema,
	createUserSchema,
} from './user.schema.buckup';

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
				body: createUserSchema,
				response: { 201: createUserResponseSchema },
			},
		},
		registerUserHandler,
	);

	// server.post(
	// 	'/login',
	// 	{
	// 		schema: {
	// 			body: loginSchema,
	// 			response: {
	// 				200: loginResponseSchema,
	// 			},
	// 		},
	// 	},
	// 	loginUserHandler,
	// );
};
