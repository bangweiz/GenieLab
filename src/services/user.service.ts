import { HTTPException } from "hono/http-exception";

import User from "../schemas/user.schema";
import * as authUtils from "../utils/auth.utils";
import { Role } from "../constants/auth";

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
