import { components } from "./types";

export type InstructionEntity = {
	_id: string;
	name: string;
	type: "personality" | "guardian" | "operation";
	organisation_id: string;
	latestVersion: number;
	createdAt: string;
	updatedAt: string;
};

export type InstructionVersionEntity = {
	_id: string;
	instruction_id: string;
	version: number;
	content: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateInstruction = components["schemas"]["CreateInstruction"];
export type UpdateInstruction = components["schemas"]["UpdateInstruction"];
export type InstructionInfo = components["schemas"]["InstructionInfo"];
export type InstructionInfoList = components["schemas"]["InstructionInfoList"];
export type InstructionDetails = components["schemas"]["InstructionDetails"];
export type InstructionVersion = components["schemas"]["InstructionVersion"];
export type InstructionVersionList = components["schemas"]["InstructionVersionList"];
