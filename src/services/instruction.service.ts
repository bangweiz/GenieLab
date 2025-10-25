import { HTTPException } from "hono/http-exception";

import Instruction from "../schemas/instruction.schema";
import InstructionVersion from "../schemas/instructionVersion.schema";
import {
	InstructionResponse,
	InstructionDetailResponse,
	InstructionListResponse,
} from "../types/gen/schemas";
import { CreateInstructionRequest } from "../types/gen/schemas";
import mongoose from "mongoose";

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

export const getInstructions = async (organisationId: string): Promise<InstructionListResponse> => {
  const instructions = await Instruction.find({ organisation: organisationId });

  const instructionIds = instructions.map(instruction => instruction._id);

  const latestVersions = await InstructionVersion.aggregate([
    { $match: { parent: { $in: instructionIds } } },
    { $sort: { version: -1 } },
    { $group: { _id: "$parent", latestVersion: { $first: "$$ROOT" } } }
  ]);

  const latestVersionsMap = new Map(latestVersions.map(version => [version._id.toString(), version.latestVersion]));

  return {
    items: instructions.map(instruction => {
      const latestVersion = latestVersionsMap.get(instruction._id.toString());
      return {
        id: instruction._id.toString(),
        name: instruction.name,
        description: instruction.description,
        type: instruction.type,
        latestVersion: latestVersion ? {
          id: latestVersion._id.toString(),
          version: latestVersion.version,
          content: latestVersion.content,
        } : undefined,
      };
    }),
    total: instructions.length,
  };
};
