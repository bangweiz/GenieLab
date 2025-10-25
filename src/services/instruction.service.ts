import { HTTPException } from "hono/http-exception";

import Instruction from "../schemas/instruction.schema";
import InstructionVersion from "../schemas/instructionVersion.schema";
import {
	InstructionResponse,
	InstructionDetailResponse,
	InstructionListResponse,
	InstructionInfo,
	UpdateInstructionRequest,
} from "../types/gen/schemas";
import { CreateInstructionRequest } from "../types/gen/schemas";
import mongoose from "mongoose";

export async function updateInstruction(
	instructionId: string,
	organisationId: string,
	instructionData: UpdateInstructionRequest,
	session: mongoose.mongo.ClientSession | null,
): Promise<InstructionResponse> {
	const instruction = await Instruction.findOne({
		_id: instructionId,
		organisation: organisationId,
	}).session(session);

	if (!instruction) {
		throw new HTTPException(404, { message: "Not Found" });
	}

	let hasChanges = false;

	if (instructionData.name && instructionData.name !== instruction.name) {
		instruction.name = instructionData.name;
		hasChanges = true;
	}

	if (
		instructionData.description &&
		instructionData.description !== instruction.description
	) {
		instruction.description = instructionData.description;
		hasChanges = true;
	}

	let savedInstructionVersion = await InstructionVersion.findOne({
		parent: instruction._id,
		version: instruction.latestVersion,
	}).session(session);

	if (!savedInstructionVersion) {
		throw new HTTPException(500, {
			message: "Latest instruction version not found. Data is inconsistent.",
		});
	}

	if (
		instructionData.content &&
		instructionData.content !== savedInstructionVersion.content
	) {
		hasChanges = true;
		const newVersionNumber = instruction.latestVersion + 1;
		const newInstructionVersion = new InstructionVersion({
			content: instructionData.content,
			version: newVersionNumber,
			parent: instruction._id,
		});
		savedInstructionVersion = await newInstructionVersion.save({ session });
		instruction.latestVersion = newVersionNumber;
	}

	let savedInstruction = instruction;
	if (hasChanges) {
		savedInstruction = await instruction.save({ session });
	}

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

export async function createInstruction(
	instruction: CreateInstructionRequest,
	organisationId: string,
	session: mongoose.mongo.ClientSession | null,
): Promise<InstructionResponse> {
	const existingInstruction = await Instruction.exists({
		where: {
			name: instruction.name,
			organisationId,
		},
	}).session(session);

	if (existingInstruction !== null) {
		throw new HTTPException(409, { message: "Conflicts" });
	}

	const newInstruction = new Instruction({
		name: instruction.name,
		description: instruction.description,
		type: instruction.type,
		latestVersion: 1,
		organisation: organisationId,
	});

	const savedInstruction = await newInstruction.save({ session });

	const instructionVersion = new InstructionVersion({
		content: instruction.content,
		version: 1,
		parent: savedInstruction._id,
	});

	const savedInstructionVersion = await instructionVersion.save({ session });

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

export const getInstructions = async (
	organisationId: string,
): Promise<InstructionListResponse> => {
	const instructions = await Instruction.find({ organisation: organisationId });

	const result: InstructionListResponse = {
		items: instructions.map(
			(instruction): InstructionInfo => ({
				id: instruction._id.toString(),
				name: instruction.name,
				description: instruction.description,
				type: instruction.type,
			}),
		),
		total: instructions.length,
	};

	return result;
};
