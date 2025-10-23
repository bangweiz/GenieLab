import { Hono } from "hono";
import { Role } from "../constants/auth";

export type App = Hono<{
	Variables: {
		user: {
			id: string;
			role: Role;
		};
	};
}>;
