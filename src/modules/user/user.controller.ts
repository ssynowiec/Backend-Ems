import { createUser, findUserByEmail, findUsers } from './user.service';
import { verifyPassword } from '../../utils/hash';
import { server } from '../../server';
import type {
	createUserSchema,
	FastifyReplyTypebox,
	FastifyRequestTypebox,
	loginSchema,
} from './user.schema.buckup';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const registerUserHandler = async (
	request: FastifyRequestTypebox<{ body: typeof createUserSchema }>,
	reply: FastifyReplyTypebox<typeof createUserSchema>,
) => {
	const data = request.body;

	try {
		const user = await createUser(data);

		return reply.status(201).send(user);
	} catch (error) {
		console.error(error);
		return reply.status(500).send({ message: 'Something went wrong' });
	}
};

export const loginUserHandler = async (
	request: FastifyRequestTypebox<{
		body: typeof loginSchema;
	}>,
	reply: FastifyReplyTypebox<typeof loginSchema>,
) => {
	const data = request.body;

	const user = await findUserByEmail(data.login);

	if (!user) {
		return reply.status(401).send({ message: 'Invalid email or password' });
	}

	const isPasswordValid = verifyPassword(
		data.password,
		user.salt,
		user.password,
	);

	if (!isPasswordValid) {
		return reply.status(401).send({ message: 'Invalid email or password' });
	}
	console.log(data);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, salt, ...rest } = user;
	const token = await server.jwt.sign(rest);

	reply.setCookie('token', token, {
		path: '/',
		domain: 'localhost',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
	});
};

export const logoutUserHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	reply.clearCookie('token'); // Usunięcie ciasteczka z tokenem
	reply.code(200).send({ message: 'Logout successful' });
};

export const getUsersHandler = async () => await findUsers();
