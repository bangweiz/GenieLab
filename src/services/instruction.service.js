const mongoose = require("mongoose");
const Instruction = require("../models/instruction.model");
const InstructionVersion = require("../models/instructionVersion.model");
const instructionMapper = require("../mappers/instruction.mapper");
const ERROR_CODE = require("../constants/errorCode");
const GenieLabError = require("../utils/GenieLabError");

/**
 * Create a new instruction and initial version
 * @param {import("../types/instruction").CreateInstruction} instructionData - The instruction data
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionInfo>}
 */
async function createInstruction(instructionData, organisationId) {
	const session = await mongoose.startSession();

	try {
		return await session.withTransaction(async () => {
			await checkNameExist(instructionData.name, organisationId, session);

			const instruction = new Instruction(
				instructionMapper.toInstructionEntity(instructionData, organisationId),
			);
			const savedInstruction = await instruction.save({ session });

			const instructionVersion = new InstructionVersion(
				instructionMapper.toInstructionVersionEntity(
					savedInstruction,
					instructionData,
				),
			);
			const savedInstructionVersion = await instructionVersion.save({
				session,
			});

			return instructionMapper.toInstructionDetail(
				savedInstruction,
				savedInstructionVersion,
			);
		});
	} finally {
		session.endSession();
	}
}

/**
 * Check if an instruction with the same name exists
 * @param {string} name
 * @param {string} organisationId
 * @param {mongoose.mongo.ClientSession} session
 * @returns {Promise<void>}
 */
async function checkNameExist(name, organisationId, session = null) {
	const instruction = await Instruction.findOne(
		{
			name,
			organisation_id: organisationId,
		},
		null,
		{ session },
	);
	if (instruction) {
		throw new GenieLabError(
			ERROR_CODE.INSTRUCTION_NAME_EXIST.code,
			ERROR_CODE.INSTRUCTION_NAME_EXIST.message,
		);
	}
}

/**
 * Get an instruction by ID with all its versions
 * @param {string} instructionId - The ID of the instruction
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionDetails>}
 */
async function getInstruction(instructionId, organisationId) {
	const instruction = await Instruction.findOne({
		_id: instructionId,
		organisation_id: organisationId,
	});

	if (!instruction) {
		throw new GenieLabError(
			ERROR_CODE.INSTRUCTION_NOT_FOUND.code,
			ERROR_CODE.INSTRUCTION_NOT_FOUND.message,
			[],
			404,
		);
	}

	const versions = await InstructionVersion.find({
		instruction_id: instructionId,
	}).sort({ version: -1 });

	return instructionMapper.toInstructionWithAllVersions(instruction, versions);
}

/**
 * Get all instructions for an organisation
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<import("../types/instruction").InstructionInfoList>}
 */
async function getAllInstructions(organisationId) {
	const instructions = await Instruction.find({
		organisation_id: organisationId,
	});
	return instructionMapper.toInstructionInfoList(instructions);
}

module.exports = {
	createInstruction,
	getInstruction,
	getAllInstructions,
};
