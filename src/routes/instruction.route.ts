import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { postOrganisationOrganisationIdInstructionsBody } from "../types/gen/endpoints/genieLabAPI";
import * as instructionService from "../services/instruction.service";
import transactionMiddleware, {
	SessionVariable,
} from "../middlewares/transaction";

const instructionRoute = new Hono<{
	Variables: SessionVariable;
}>();

instructionRoute.post(
	"/organisations/:organisationId/instructions",
	zValidator("json", postOrganisationOrganisationIdInstructionsBody),
	transactionMiddleware,
	async (c) => {
		const organisationId = c.req.param("organisationId");
		const instructionData = c.req.valid("json");
		const session = c.get("session");

		const createdInstruction = await instructionService.createInstruction(
			instructionData,
			organisationId,
			session,
		);

		return c.json(createdInstruction, 201);
	},
);

instructionRoute.get(
	"/organisations/:organisationId/instructions/:instructionId",
	async (c) => {
		const organisationId = c.req.param("organisationId");
		const instructionId = c.req.param("instructionId");

		const instruction = await instructionService.getInstruction(
			instructionId,
			organisationId,
		);

		return c.json(instruction);
	},
);

export default instructionRoute;
