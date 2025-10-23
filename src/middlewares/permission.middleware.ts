import { HTTPException } from "hono/http-exception";
import { Role } from "../constants/auth";
import { MiddlewareHandler } from "hono";
import { App } from "../types/app";

const permissionMiddleware = (
	requiredRole: Role,
): MiddlewareHandler<App["Variables"]> => {
	return async (c, next) => {
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
};

const checkPermission = (userRole: Role, requiredRole: Role): boolean => {
	if (userRole === Role.Root) {
		return true;
	}
	if (requiredRole === Role.Admin && userRole === Role.Admin) {
		return true;
	}
	if (
		requiredRole === Role.User &&
		(userRole === Role.Admin || userRole === Role.User)
	) {
		return true;
	}
	return false;
};

export default permissionMiddleware;
