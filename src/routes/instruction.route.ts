import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { postOrganisationOrganisationIdInstructionsBody } from "../types/gen/endpoints/genieLabAPI";
import * as instructionService from "../services/instruction.service";

const instructionRoute = new Hono().basePath("");

instructionRoute.post(
	"/organisations/:organisationId/instructions",
	zValidator("json", postOrganisationOrganisationIdInstructionsBody),
	async (c) => {
		const organisationId = c.req.param("organisationId");
		const instructionData = c.req.valid("json");

		const createdInstruction = await instructionService.createInstruction(
			instructionData,
			organisationId,
		);

		return c.json(createdInstruction, 201);
	},
);

export default instructionRoute;
