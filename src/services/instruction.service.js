const Instruction = require("../models/instruction.model");
const instructionMapper = require("../mappers/instruction.mapper");
const { ERROR_CODE } = require("../constants/errorCode");

/**
 * Create a new instruction
 * @param {import("../types/instruction").CreateInstruction} instructionData - The instruction data
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionInfo>}
 */
async function createInstruction(instructionData, organisationId) {
	await checkNameExist(instructionData.name, organisationId);
	const instruction = new Instruction(
		instructionMapper.toEntity(instructionData, organisationId),
	);
	const savedInstruction = await instruction.save();
	return instructionMapper.toInfo(savedInstruction);
};

/**
 * 
 * @param {string} name 
 * @param {string} organisationId 
 * @returns {Promise<void>}
 */
async function checkNameExist(name, organisationId) {
	const instruction = await Instruction.findOne({ name, organisation_id: organisationId });
	if (instruction) {
		throw new GenieLabError(
			ERROR_CODE.INSTRUCTION_NAME_EXIST.code,
			ERROR_CODE.INSTRUCTION_NAME_EXIST.message,
		);
	}
}

module.exports = {
	createInstruction,
};
