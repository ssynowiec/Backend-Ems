import fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { userRouter } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
import { eventSchemas } from './modules/event/event.schema';
import { eventRouter } from './modules/event/event.route';

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}
}

export const prisma = new PrismaClient();
export const server = fastify();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

server.register(fastifyJwt, {
	secret: SECRET_KEY,
});

server.decorate('authenticate', async (request, reply) => {
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
