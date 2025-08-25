/**
 * Convert instruction entity and instruction version entity to instruction detail
 * @param {import("../types/instruction").InstructionEntity} instruction
 * @param {import("../types/instruction").InstructionVersionEntity} instructionVersion
 * @returns {import("../types/instruction").InstructionDetails}
 */
function toInstructionDetail(instruction, instructionVersion) {
	return {
		instructionId: instruction._id,
		name: instruction.name,
		type: instruction.type,
		versions: [toInstructionVersionInfo(instructionVersion)],
	};
}

/**
 * Convert instruction creation data to instruction entity
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
 * Convert instruction creating data and instruction entity to instruction version entity
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
 * Convert instruction entity and instruction version entities to instruction details
 * @param {import("../types/instruction").InstructionEntity} instruction
 * @param {import("../types/instruction").InstructionVersionEntity[]} instructionVersions
 * @returns {import("../types/instruction").InstructionDetails}
 */
function toInstructionWithAllVersions(instruction, instructionVersions) {
	return {
		instructionId: instruction._id,
		name: instruction.name,
		type: instruction.type,
		versions: instructionVersions.map(toInstructionVersionInfo),
	};
}

/**
 * Convert instruction version entity to instruction version info
 * @param {import("../types/instruction").InstructionVersionEntity} instructionVersionEntity
 * @returns {import("../types/instruction").InstructionVersionInfo}
 */
function toInstructionVersionInfo(instructionVersionEntity) {
	return {
		instructionVersionId: instructionVersionEntity._id,
		version: instructionVersionEntity.version,
		description: instructionVersionEntity.description,
		content: instructionVersionEntity.content,
	};
}

/**
 * Convert instruction version entity to instruction info
 * @param {import("../types/instruction").InstructionEntity} instructionEntity
 * @returns {import("../types/instruction").InstructionInfo}
 */
function toInstructionInfo(instructionEntity) {
	return {
		instructionId: instructionEntity._id,
		name: instructionEntity.name,
		type: instructionEntity.type,
	};
}

/**
 * Convert instruction entities to instruction info list
 * @param {import("../types/instruction").InstructionEntity[]} instructionEntities
 * @returns {import("../types/instruction").InstructionInfoList}
 * */
function toInstructionInfoList(instructionEntities) {
	return instructionEntities.map(toInstructionInfo);
}

module.exports = {
	toInstructionDetail,
	toInstructionEntity,
	toInstructionVersionEntity,
	toInstructionWithAllVersions,
	toInstructionInfoList,
	toInstructionVersionInfo,
};
