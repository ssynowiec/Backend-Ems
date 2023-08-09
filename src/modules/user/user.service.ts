import { prisma } from '../../server';
import { hashPassword } from '../../utils/hash';

interface UserCreateData {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}

export const createUser = async (data: UserCreateData) => {
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
