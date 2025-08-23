const Instruction = require("../models/instruction.model");
const InstructionVersion = require("../models/instruction_version.model");
const instructionMapper = require("../mappers/instruction.mapper");
const { ERROR_CODE } = require("../constants/errorCode");
const GenieLabError = require("../utils/GenieLabError");

/**
 * Create a new instruction
 * @param {import("../types/instruction").CreateInstruction} instructionData - The instruction data
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionInfo>}
 */
async function createInstruction(instructionData, organisationId) {
	await checkNameExist(instructionData.name, organisationId);

	const instruction = new Instruction({
		name: instructionData.name,
		type: instructionData.type,
		organisation_id: organisationId,
		latestVersion: 1,
	});
	const savedInstruction = await instruction.save();

	const instructionVersion = new InstructionVersion({
		instruction_id: savedInstruction._id,
		version: 1,
		content: instructionData.content,
		description: instructionData.description,
	});
	const savedInstructionVersion = await instructionVersion.save();

	return instructionMapper.toInfo(savedInstruction, savedInstructionVersion);
}

/**
 *
 * @param {string} name
 * @param {string} organisationId
 * @returns {Promise<void>}
 */
async function checkNameExist(name, organisationId) {
	const instruction = await Instruction.findOne({
		name,
		organisation_id: organisationId,
	});
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
