import { HTTPException } from "hono/http-exception";
import { jwtVerify } from "jose";
import { Role } from "../constants/auth";
import { MiddlewareHandler } from "hono";
import { App } from "../types/app";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

const authMiddleware: MiddlewareHandler<App["Variables"]> = async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		if (!payload) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}
		c.set("user", {
			id: payload.userId as string,
			role: payload.role as Role,
		});
	} catch (e) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	await next();
};

export default authMiddleware;
