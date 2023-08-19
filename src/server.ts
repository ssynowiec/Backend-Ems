import fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cookie, { type FastifyCookieOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { userRouter } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
import { eventSchemas } from './modules/event/event.schema';
import { eventRouter } from './modules/event/event.route';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}
}

export const prisma = new PrismaClient();
export const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

server.register(cors, {
	origin: 'http://localhost:3000',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

server.register(fastifyJwt, {
	secret: SECRET_KEY,
	cookie: {
		cookieName: 'token',
		signed: false,
	},
});

server.register(cookie, {
	secret: SECRET_KEY,
	hook: 'onRequest',
	parseOptions: {},
} as FastifyCookieOptions);

server.decorate('authenticate', async (request, reply) => {
	console.log(request.cookies);
	try {
		await request.jwtVerify();
	} catch (e) {
		return reply.send(e);
	}
});

server.get('/status', async () => ({ status: 'ok' }));

for (const schema of [...userSchemas, ...eventSchemas]) {
	server.addSchema(schema);
}

const PORT = (process.env.PORT || 3000) as number;
const start = async () => {
	server.register(userRouter, { prefix: 'api/users' });
	server.register(eventRouter, { prefix: 'api/events' });

	try {
		await server.listen({ port: PORT });

		server
			.addresses()
			.map(address =>
				console.log(
					`🚀 (${address.family}) Server is listening at http://${address.address}:${address.port}`,
				),
			);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();
