import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { postOrganisationOrganisationIdInstructionsBody } from "../types/gen/endpoints/genieLabAPI";
import * as instructionService from "../services/instruction.service";
import transactionMiddleware, {
	SessionVariable,
} from "../middlewares/transaction";
import authMiddleware, { AuthVariable } from "../middlewares/auth.middleware";
import permissionMiddleware from "../middlewares/permission.middleware";
import { Role } from "../constants/auth";

const instructionRoute = new Hono<{
	Variables: AuthVariable & SessionVariable;
}>();

instructionRoute.post(
	"/organisations/:organisationId/instructions",
	authMiddleware,
	permissionMiddleware(Role.Admin),
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
	authMiddleware,
	permissionMiddleware(Role.User),
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

instructionRoute.get(
	"/organisations/:organisationId/instructions",
	authMiddleware,
	permissionMiddleware(Role.Admin),
	async (c) => {
		const organisationId = c.req.param("organisationId");
		const instructions = await instructionService.getInstructions(organisationId);
		return c.json(instructions);
	},
);

export default instructionRoute;
