import { prisma } from '../../server';
import type { CreateEventInput, UpdateEventInput } from './event.schema';

export const findEvents = async () =>
	prisma.event.findMany({
		select: {
			id: true,
			code: true,
			title: true,
			description: true,
			location: true,
			published: true,
			updated_at: true,
			creator_id: true,
			created_at: true,
			creator: {
				select: {
					first_name: true,
					last_name: true,
				},
			},
		},
	});

export const findEventById = async (id: number) =>
	await prisma.event.findUnique({
		where: { id: id },
	});

export const createEvent = async (
	data: CreateEventInput & { creator_id: number },
) => {
	const created_at = new Date().toISOString();
	const updated_at = created_at;
	const { ...rest } = data;
	return await prisma.event.create({
		data: { ...rest, created_at: created_at, updated_at: updated_at },
	});
};

export const updateEvent = async (data: UpdateEventInput & { id: number }) => {
	const { id, ...rest } = data;
	return await prisma.event.update({
		where: { id: id },
		data: { ...rest },
	});
};
