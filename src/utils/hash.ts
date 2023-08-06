import crypto from 'crypto';

export const hashPassword = (password: string) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto
		.pbkdf2Sync(password, salt, 10000, 512, 'sha512')
		.toString('hex');

	return { salt, hash };
};

export const verifyPassword = (
	candidatePassword: string,
	salt: string,
	hash: string,
): boolean => {
	const candidateHash = crypto
		.pbkdf2Sync(candidatePassword, salt, 10000, 512, 'sha512')
		.toString('hex');

	return candidateHash === hash;
};
