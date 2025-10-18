import { HTTPException } from "hono/http-exception";

import User from "../schemas/user.schema";
import * as authUtils from "../utils/auth.utils";
import { Role } from "../constants/auth";
import { LoginResponse } from "../types/gen/schemas";

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

export async function login(
	email: string,
	password: string,
): Promise<LoginResponse> {
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

	return authUtils.createToken(email, user.role, user.organisation.toString());
}
