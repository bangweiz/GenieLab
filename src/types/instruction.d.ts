import { components } from "./types";

export type CreateInstruction = components["schemas"]["CreateInstruction"];
export type UpdateInstruction = components["schemas"]["UpdateInstruction"];
export type InstructionInfo = components["schemas"]["InstructionInfo"];

export type InstructionType = "personality" | "guardian" | "operation";

export type Instruction = {
	instruction_id: string;
	version: number;
	name: string;
	content: string;
	type: InstructionType;
	organisation_id: string;
	createdAt: string;
	updatedAt: string;
};
