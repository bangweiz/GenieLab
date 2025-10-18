import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { postOrganisationBody } from "../types/gen/endpoints/genieLabAPI";
import * as organisationService from "../services/organisation.service";
import * as userService from "../services/user.service";
import { Role } from "../constants/auth";

const organisationRoute = new Hono().basePath("/organisation");

organisationRoute.get("/test", (c) => {
	return c.text("Org route works!");
});

organisationRoute.post(
	"/",
	zValidator("json", postOrganisationBody),
	async (c) => {
		const {
			name,
			phone,
			address,
			rootUser: { email, password },
		} = c.req.valid("json");
		const createdOrganisation = await organisationService.createOrganisation(
			name,
			phone,
			address,
		);
		await userService.createUser(
			email,
			password,
			Role.Root,
			createdOrganisation.id,
		);
		return c.json(createdOrganisation);
	},
);

export default organisationRoute;
