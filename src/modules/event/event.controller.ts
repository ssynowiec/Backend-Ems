import {
	createEvent,
	findEventById,
	findEvents,
	updateEvent,
} from './event.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateEventInput, UpdateEventInput } from './event.schema';

export const createEventHandler = async (
	request: FastifyRequest<{ Body: CreateEventInput }>,
	reply: FastifyReply,
) => {
	const data = request.body;
	const { id: creator_id } = request.user as { id: number };

	try {
		const event = await createEvent({ ...data, creator_id: creator_id });

		return reply.status(201).send(event);
	} catch (error) {
		console.error(error);
		return reply.status(500).send({ message: 'Something went wrong' });
	}
};

export const updateEventHandler = async (
	request: FastifyRequest<{ Body: UpdateEventInput }>,
	reply: FastifyReply,
) => {
	const data = request.body;
	const { id } = request.params as { id: string };

	try {
		const event = await updateEvent({
			...data,
			id: parseInt(id),
		});
		return reply.status(201).send(event);
	} catch (error) {
		console.error(error);
		return { message: 'Something went wrong' };
	}
};

export const getAllEventsHandler = async () => await findEvents();

export const getEventByIdHandler = async (request: FastifyRequest) => {
	const { id } = request.params as { id: string };

	return await findEventById(parseInt(id));
};
