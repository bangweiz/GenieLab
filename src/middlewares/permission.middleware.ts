import { HTTPException } from "hono/http-exception";
import { Role } from "../constants/auth";
import { Context, Next } from "hono";

function permissionMiddleware(requiredRole: Role) {
	return async (c: Context, next: Next) => {
		const user = c.get("user");
		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		const hasPermission = checkPermission(user.role, requiredRole);
		if (!hasPermission) {
			throw new HTTPException(403, { message: "Forbidden" });
		}

		await next();
	};
}

const checkPermission = (userRole: Role, requiredRole: Role): boolean => {
	switch (requiredRole) {
		case Role.Root:
			return userRole === Role.Root;
		case Role.Admin:
			return userRole === Role.Root || userRole === Role.Admin;
		case Role.User:
			return true;
		default:
			return false;
	}
};

export default permissionMiddleware;
