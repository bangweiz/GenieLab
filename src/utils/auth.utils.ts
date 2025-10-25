import { JWTVerifyResult, SignJWT, jwtVerify } from "jose";

import { Role } from "../constants/auth";
import { LoginResponse } from "../types/gen/schemas";

const COST = 10;
const ONE_HOUR = 60 * 60 * 1000;
const JWT_SECRET = Bun.env.JWT_SECRET || "secret";
const TEXT_ENCODING = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
	return await Bun.password.hash(password, {
		algorithm: "bcrypt",
		cost: COST,
	});
}

export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await Bun.password.verify(password, hashedPassword);
}

export async function createToken(
	email: string,
	userId: string,
	role: Role,
	organisationId: string,
): Promise<LoginResponse> {
	const expiration = new Date(Date.now() + ONE_HOUR);
	const token = await new SignJWT({ email, userId, role, organisationId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiration)
		.sign(TEXT_ENCODING);
	return { token, expiration: expiration.toISOString() };
}

export async function verifyToken(
	token: string,
): Promise<JWTVerifyResult<UserProps>> {
	return await jwtVerify(token, TEXT_ENCODING);
}

type UserProps = {
	email: string;
	userId: string;
	role: Role;
	organisationId: string;
};
