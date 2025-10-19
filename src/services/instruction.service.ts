import { CreateInstructionRequest } from "../types/gen/schemas/CreateInstructionRequest";

export const createInstruction = async (
	instruction: CreateInstructionRequest,
	organisationId: string,
) => {
	// Mock implementation
	return {
		id: "mock-instruction-id",
		...instruction,
		organisationId,
		version: 1,
	};
};
