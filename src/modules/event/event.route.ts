import type { FastifyInstance } from 'fastify';
import {
	createEventHandler,
	getAllEventsHandler,
	getEventByIdHandler,
	updateEventHandler,
} from './event.controller';
import { $ref } from './event.schema';

export const eventRouter = async (server: FastifyInstance) => {
	server.get(
		'/',
		{
			preHandler: [server.authenticate],
		},
		getAllEventsHandler,
	);

	server.get(
		'/:id',
		{
			preHandler: [server.authenticate],
		},
		getEventByIdHandler,
	);

	server.post(
		'/',
		{
			preHandler: [server.authenticate],
			schema: {
				body: $ref('createEventSchema'),
				response: {
					201: $ref('eventResponseSchema'),
				},
			},
		},
		createEventHandler,
	);

	server.put(
		'/:id',
		{
			preHandler: [server.authenticate],
			schema: {
				body: $ref('updateEventSchema'),
				response: {
					201: $ref('eventResponseSchema'),
				},
			},
		},
		updateEventHandler,
	);
};
