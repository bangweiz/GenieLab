/**
 * @param {import("../types/instruction").Instruction} instruction
 * @param {import("../types/instruction").InstructionVersion} instructionVersion
 * @returns {import("../types/instruction").InstructionInfo}
 */
function toInfo(instruction, instructionVersion) {
	return {
		instructionId: instruction._id.toString(),
		name: instruction.name,
		type: instruction.type,
		version: instructionVersion.version,
		content: instructionVersion.content,
		description: instructionVersion.description,
	};
}

module.exports = {
	toInfo,
};
