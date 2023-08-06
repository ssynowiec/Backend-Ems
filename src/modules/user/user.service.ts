import { prisma } from '../../server';
import { hashPassword } from '../../utils/hash';
import type { CreateUserInput } from './user.schema';

export const createUser = async (data: CreateUserInput) => {
	const { password, ...rest } = data;

	const { salt, hash } = hashPassword(password);

	return await prisma.user.create({
		data: {
			...rest,
			salt,
			password: hash,
		},
	});
};

export const findUserByEmail = (email: string) =>
	prisma.user.findUnique({
		where: {
			email,
		},
	});

export const findUsers = async () =>
	prisma.user.findMany({
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			role: true,
		},
	});
