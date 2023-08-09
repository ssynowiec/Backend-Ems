import { Type } from '@sinclair/typebox';
import type {
	ContextConfigDefault,
	FastifyReply,
	FastifyRequest,
	FastifySchema,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
	RouteGenericInterface,
} from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export type FastifyRequestTypebox<TSchema extends FastifySchema> =
	FastifyRequest<
		RouteGenericInterface,
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		TSchema,
		TypeBoxTypeProvider
	>;

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	RouteGenericInterface,
	ContextConfigDefault,
	TSchema,
	TypeBoxTypeProvider
>;

export const userCore = Type.Object({
	email: Type.String({ format: 'email', errorMessage: 'Email is required' }),
	first_name: Type.String(),
	last_name: Type.String(),
});

export const createUserSchema = Type.Intersect([
	userCore,
	Type.Object({
		password: Type.String({
			minLength: 8,
			errorMessage:
				'Password is required and should be at least 8 characters long',
		}),
	}),
]);

export const createUserResponseSchema = Type.Intersect([
	userCore,
	Type.Object({
		id: Type.Number(),
	}),
]);

export const loginSchema = Type.Object({
	email: Type.String({ format: 'email', errorMessage: 'Email is required' }),
	password: Type.String({
		errorMessage: 'Password must be a string',
	}),
});

export const loginResponseSchema = Type.Object({
	accessToken: Type.String(),
});
