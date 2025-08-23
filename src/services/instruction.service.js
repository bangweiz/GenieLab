const Instruction = require("../models/instruction.model");
const instructionMapper = require("../mappers/instruction.mapper");

/**
 * Create a new instruction
 * @param {import("../types/instruction").CreateInstruction} instructionData - The instruction data
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionInfo>}
 */
const createInstruction = async (instructionData, organisationId) => {
	const instruction = new Instruction(
		instructionMapper.toEntity(instructionData, organisationId),
	);
	const savedInstruction = await instruction.save();
	return instructionMapper.toInfo(savedInstruction);
};

module.exports = {
	createInstruction,
};
