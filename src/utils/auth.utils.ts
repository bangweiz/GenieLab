import { SignJWT } from "jose";

import { Role } from "../constants/auth";
import { LoginResponse } from "../types/gen/schemas";

const COST = 10;
const ONE_HOUR = 60 * 60 * 1000;
const JWT_SECRET = Bun.env.JWT_SECRET || "secret";

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
	role: Role,
	organisationId: string,
): Promise<LoginResponse> {
	const token = await new SignJWT({ email, role, organisationId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(ONE_HOUR)
		.sign(new TextEncoder().encode(JWT_SECRET));
	const expiration = new Date(Date.now() + ONE_HOUR).toISOString();
	return { token, expiration };
}
