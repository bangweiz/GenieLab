import { HTTPException } from "hono/http-exception";
import { SignJWT } from "jose";

import User from "../schemas/user.schema";
import * as authUtils from "../utils/auth.utils";
import { Role } from "../constants/auth";
import { JWT_SECRET } from "../config/env.config";

export async function createUser(
	email: string,
	password: string,
	role: Role,
	organisationId: string,
) {
	const existUser = await User.exists({ email });
	if (existUser !== null) {
		throw new HTTPException(409, { message: "Conflicts" });
	}
	const hashedPassword = await authUtils.hashPassword(password);
	const user = new User({
		email,
		password: hashedPassword,
		role,
		organisation: organisationId,
	});
	await user.save();
}

export async function login(email: string, password: string) {
	const user = await User.findOne({ email });
	if (user === null) {
		throw new HTTPException(401, { message: "Invalid credentials" });
	}
	const isPasswordCorrect = await authUtils.verifyPassword(
		password,
		user.password,
	);
	if (!isPasswordCorrect) {
		throw new HTTPException(401, { message: "Invalid credentials" });
	}

	const expiration = new Date(Date.now() + 60 * 60 * 1000);
	const token = await new SignJWT({
		id: user.id,
		role: user.role,
		organisationId: user.organisation,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(new TextEncoder().encode(JWT_SECRET));
	return { token, expiration: expiration.toISOString() };
}
