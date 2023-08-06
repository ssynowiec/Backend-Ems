import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { userRouter } from './modules/user/user.route';

export const prisma = new PrismaClient();
const server = fastify();

server.get('/status', async () => {
	return { status: 'ok' };
});

server.get('/feed', async (req, res) => {
	return await prisma.post.findMany({
		where: { published: true },
		include: { author: true },
	});
});

server.get('/add', async (req, res) => {
	// return await prisma.user.create({
	// 	data: {
	// 		name: 'Alice',
	// 		email: 'alice@example.com',
	// 	},
	// });

	return await prisma.post.create({
		data: {
			title: 'Prisma makes databases easy',
			content: 'You can query, migrate, and model your database with ease.',
			published: true,
			authorId: 1,
		},
	});
});

const PORT = (process.env.PORT || 3000) as number;
const start = async () => {
	server.register(userRouter, { prefix: 'api/users' });

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

start();
