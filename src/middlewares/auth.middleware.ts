import { HTTPException } from "hono/http-exception";
import { Role } from "../constants/auth";
import { Context, Next } from "hono";
import { verifyToken } from "../utils/auth.utils";

async function authMiddleware(c: Context, next: Next) {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	try {
		const { payload } = await verifyToken(token);

		if (!payload) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}
		c.set("user", {
			email: payload.email,
			role: payload.role,
			organisationId: payload.organisationId,
			userId: payload.userId,
		});
	} catch (e) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	await next();
}

export type AuthVariable = {
	user: {
		email: string;
		role: Role;
		organisationId: string;
		userId: string;
	};
};

export default authMiddleware;
