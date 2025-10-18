import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as userService from "../services/user.service";
import { postLoginBody } from "../types/gen/endpoints/genieLabAPI";

const authRoute = new Hono().basePath("/auth");

authRoute.post(
	"/login",
	zValidator("json", postLoginBody),
	async (c) => {
		const { email, password } = c.req.valid("json");
		const { token, expiration } = await userService.login(email, password);
		return c.json({ token, expiration });
	},
);

export default authRoute;