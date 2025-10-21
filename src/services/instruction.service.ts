import { HTTPException } from "hono/http-exception";

import Instruction from "../schemas/instruction.schema";
import InstructionVersion from "../schemas/instructionVersion.schema";
import {
	InstructionResponse,
	InstructionDetailResponse,
} from "../types/gen/schemas";
import { CreateInstructionRequest } from "../types/gen/schemas";

export async function createInstruction(
	instruction: CreateInstructionRequest,
	organisationId: string,
): Promise<InstructionResponse> {
	const existingInstruction = await Instruction.exists({
		where: {
			name: instruction.name,
			organisationId,
		},
	});

	if (existingInstruction !== null) {
		throw new HTTPException(409, { message: "Conflicts" });
	}

	const savedInstruction = await Instruction.create({
		name: instruction.name,
		description: instruction.description,
		type: instruction.type,
		latestVersion: 1,
		organisation: organisationId,
	});

	const savedInstructionVersion = await InstructionVersion.create({
		content: instruction.content,
		version: 1,
		parent: savedInstruction._id,
	});

	return {
		id: savedInstruction._id.toString(),
		name: savedInstruction.name,
		description: savedInstruction.description,
		type: savedInstruction.type,
		latestVersion: {
			id: savedInstructionVersion._id.toString(),
			content: savedInstructionVersion.content,
			version: savedInstructionVersion.version,
		},
	};
}

export async function getInstruction(
	instructionId: string,
	organisationId: string,
): Promise<InstructionDetailResponse> {
	const instruction = await Instruction.findOne({
		_id: instructionId,
		organisation: organisationId,
	});

	if (!instruction) {
		throw new HTTPException(404, { message: "Not Found" });
	}

	const instructionVersions = await InstructionVersion.find({
		parent: instruction._id,
	});

	return {
		id: instruction._id.toString(),
		name: instruction.name,
		description: instruction.description,
		type: instruction.type,
		versions: instructionVersions.map((version) => ({
			id: version._id.toString(),
			version: version.version,
			content: version.content,
		})),
	};
}
