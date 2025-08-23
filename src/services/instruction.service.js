const Instruction = require("../models/instruction.model");
const { v4: uuidv4 } = require("uuid");

/**
 * Create a new instruction
 * @param {object} instructionData - The instruction data
 * @param {string} organisationId - The ID of the organisation
 * @returns {Promise<Instruction>}
 */
const createInstruction = async (instructionData, organisationId) => {
	const instruction = new Instruction({
		...instructionData,
		instruction_id: uuidv4(),
		organisation_id: organisationId,
	});
	return await instruction.save();
};

module.exports = {
	createInstruction,
};
