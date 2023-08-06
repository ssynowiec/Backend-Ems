import { createUser, findUserByEmail, findUsers } from './user.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyPassword } from '../../utils/hash';
import { server } from '../../server';
import type { CreateUserInput, LoginInput } from './user.schema';

export const registerUserHandler = async (
	request: FastifyRequest<{ Body: CreateUserInput }>,
	reply: FastifyReply,
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
	request: FastifyRequest<{
		Body: LoginInput;
	}>,
	reply: FastifyReply,
) => {
	const data = request.body;

	const user = await findUserByEmail(data.email);

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, salt, ...rest } = user;
	return { accessToken: server.jwt.sign(rest) };
};

export const getUsersHandler = async () => await findUsers();
