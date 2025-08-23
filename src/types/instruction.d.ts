import { components } from "./types";

export type InstructionEntity = {
	_id: string;
	instruction_id: string;
	version: number;
	name: string;
	content: string;
	type: "personality" | "guardian" | "operation";
	organisation_id: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateInstruction = components["schemas"]["CreateInstruction"];
export type UpdateInstruction = components["schemas"]["UpdateInstruction"];
export type InstructionInfo = components["schemas"]["InstructionInfo"];
