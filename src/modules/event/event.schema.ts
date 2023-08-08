import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const eventCore = {
	code: z.string(),
	title: z.string(),
	description: z.string(),
	location: z.string(),
	published: z.boolean().default(false),
	updated_at: z.string().default(() => new Date().toISOString()),
	facebook_link: z.string().optional(),
	facebook_event_id: z.string().optional(),
	instagram_link: z.string().optional(),
	linkedin_link: z.string().optional(),
	linked_event_link: z.string().optional(),
	twitter_link: z.string().optional(),
	youtube_link: z.string().optional(),
	tiktok_link: z.string().optional(),
};

const createEventSchema = z.object({
	...eventCore,
});

const createEventInput = z.object({
	...eventCore,
	created_at: z.string().default(() => new Date().toISOString()),
});

const updateEventSchema = z.object({
	...eventCore,
	code: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	published: z.boolean().optional(),
	facebook_link: z.string().optional(),
});

const updateEventInput = z.object({
	...eventCore,
	updated_at: z.string().default(() => new Date().toISOString()),
});

const eventResponseSchema = z.object({
	id: z.number(),
	...createEventInput.shape,
	creator_id: z.number(),
});

export type CreateEventInput = z.infer<typeof createEventInput>;

export type UpdateEventInput = z.infer<typeof updateEventInput>;

export const { schemas: eventSchemas, $ref } = buildJsonSchemas(
	{
		eventResponseSchema,
		createEventSchema,
		updateEventSchema,
	},
	{ $id: 'eventSchema' },
);
