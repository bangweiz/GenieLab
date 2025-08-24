/**
 * @param {import("../types/instruction").InstructionEntity} instruction
 * @param {import("../types/instruction").InstructionVersionEntity} instructionVersion
 * @returns {import("../types/instruction").InstructionDetails}
 */
function toInstructionDetail(instruction, instructionVersion) {
	return {
		instructionId: instruction._id,
		name: instruction.name,
		type: instruction.type,
		versions: [
			{
				instructionVersionId: instructionVersion._id,
				version: instructionVersion.version,
				description: instructionVersion.description,
				content: instructionVersion.content,
			},
		],
	};
}

/**
 *
 * @param {import("../types/instruction").CreateInstruction} instructionData
 * @param {string} organisationId
 * @returns {import("../types/instruction").InstructionEntity}
 */
function toInstructionEntity(instructionData, organisationId) {
	return {
		name: instructionData.name,
		type: instructionData.type,
		organisation_id: organisationId,
		latestVersion: 1,
	};
}

/**
 *
 * @param {import("../types/instruction").InstructionEntity} instructionEntity
 * @param {import("../types/instruction").CreateInstruction} instructionData
 * @returns {import("../types/instruction").InstructionVersionEntity}
 */
function toInstructionVersionEntity(instructionEntity, instructionData) {
	return {
		instruction_id: instructionEntity._id,
		version: instructionEntity.latestVersion,
		content: instructionData.content,
		description: instructionData.description,
	};
}

/**
 * @param {import("../types/instruction").InstructionEntity} instruction
 * @param {import("../types/instruction").InstructionVersionEntity[]} instructionVersions
 * @returns {import("../types/instruction").InstructionDetails}
 */
function toInstructionWithAllVersions(instruction, instructionVersions) {
	return {
		instructionId: instruction._id,
		name: instruction.name,
		type: instruction.type,
		versions: instructionVersions.map((version) => ({
			instructionVersionId: version._id,
			version: version.version,
			description: version.description,
			content: version.content,
		})),
	};
}

module.exports = {
	toInstructionDetail,
	toInstructionEntity,
	toInstructionVersionEntity,
	toInstructionWithAllVersions,
};
