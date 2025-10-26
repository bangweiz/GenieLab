import { HTTPException } from "hono/http-exception";
import mongoose from "mongoose";

import Instruction from "../schemas/instruction.schema";
import InstructionVersion from "../schemas/instructionVersion.schema";
import {
	CreateInstructionRequest,
	InstructionDetailResponse,
	InstructionInfo,
	InstructionListResponse,
	InstructionResponse,
	UpdateInstructionRequest,
} from "../types/gen/schemas";

export async function updateInstruction(
	instructionId: string,
	organisationId: string,
	instructionData: UpdateInstructionRequest,
	session: mongoose.mongo.ClientSession | null,
): Promise<InstructionResponse> {
	// Find the initial instruction state
	const instruction =
		await Instruction.findById(instructionId).session(session);

	if (!instruction) {
		throw new HTTPException(404, { message: "Not Found" });
	}

	// Find the latest version for content comparison
	let latestVersion = await InstructionVersion.findOne({
		parent: instruction._id,
		version: instruction.latestVersion,
	}).session(session);

	if (!latestVersion) {
		throw new HTTPException(500, {
			message: "Latest instruction version not found. Data is inconsistent.",
		});
	}

	const nameChanged =
		instructionData.name && instructionData.name !== instruction.name;
	const descriptionChanged =
		instructionData.description &&
		instructionData.description !== instruction.description;
	const contentChanged =
		instructionData.content &&
		instructionData.content !== latestVersion.content;

	// If no fields have changed, do not perform any writes.
	if (!nameChanged && !descriptionChanged && !contentChanged) {
		return {
			id: instruction._id.toString(),
			name: instruction.name,
			description: instruction.description,
			type: instruction.type,
			latestVersion: {
				id: latestVersion._id.toString(),
				content: latestVersion.content,
				version: latestVersion.version,
			},
		};
	}

	// Apply metadata updates
	if (nameChanged) {
		instruction.name = instructionData.name!;
	}
	if (descriptionChanged) {
		instruction.description = instructionData.description!;
	}

	// If content has changed, create a new version
	if (contentChanged) {
		// Atomically increment the version number on the parent document
		const updatedInstruction = await Instruction.findOneAndUpdate(
			{ _id: instruction._id },
			{ $inc: { latestVersion: 1 } },
			{ new: true, session },
		);

		if (!updatedInstruction) {
			throw new HTTPException(500, {
				message: "Failed to update instruction version.",
			});
		}
		instruction.latestVersion = updatedInstruction.latestVersion;

		const newInstructionVersion = new InstructionVersion({
			content: instructionData.content,
			version: instruction.latestVersion,
			parent: instruction._id,
		});
		latestVersion = await newInstructionVersion.save({ session });
	}

	const savedInstruction = await instruction.save({ session });

	return {
		id: savedInstruction._id.toString(),
		name: savedInstruction.name,
		description: savedInstruction.description,
		type: savedInstruction.type,
		latestVersion: {
			id: latestVersion._id.toString(),
			content: latestVersion.content,
			version: latestVersion.version,
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
