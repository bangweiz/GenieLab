import { components } from "./types";

export type Instruction = {
	_id: string;
	name: string;
	type: "personality" | "guardian" | "operation";
	organisation_id: string;
	latestVersion: number;
	createdAt: string;
	updatedAt: string;
};

export type InstructionVersion = {
	_id: string;
	instruction_id: string;
	version: number;
	content: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateInstruction = components["schemas"]["CreateInstruction"];
export type UpdateInstruction = components["schemas"]["UpdateInstruction"];
export type InstructionInfo = components["schemas"]["InstructionInfo"];
