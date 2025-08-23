const mongoose = require("mongoose");
const Instruction = require("../models/instruction.model");
const InstructionVersion = require("../models/instruction_version.model");
const instructionMapper = require("../mappers/instruction.mapper");
const { ERROR_CODE } = require("../constants/errorCode");
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
 *
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

module.exports = {
	createInstruction,
};
