const { v4: uuidv4 } = require("uuid");
/**
 * @param {import("../types/instruction").CreateInstruction} createInstruction
 * @param {string} organisationId
 * @returns {import("../types/instruction").InstructionEntity}
 */
function toEntity(createInstruction, organisationId) {
	return {
		instruction_id: uuidv4(),
		version: 1,
		name: createInstruction.name,
		content: createInstruction.content,
		type: createInstruction.type,
		organisation_id: organisationId,
	};
}

/**
 * @param {import("../types/instruction").InstructionEntity} instructionEntity
 * @returns {import("../types/instruction").InstructionInfo}
 */
function toInfo(instructionEntity) {
	return {
		instructionId: instructionEntity.instruction_id,
		version: instructionEntity.version,
		name: instructionEntity.name,
		content: instructionEntity.content,
		type: instructionEntity.type,
	};
}

module.exports = {
	toEntity,
	toInfo,
};
