const instructionService = require("../services/instruction.service");

/**
 * Create a new organisation with a root user
 * @param {import('express').Request<any, any, import('../types/instruction').CreateInstruction> & { user: import('../types/user').UserInfo }} req - The request object with CreateOrganisation body
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function createInstruction(req, res) {
	const instruction = await instructionService.createInstruction(
		req.body,
		req.user.organisationId,
	);
	res.status(201).json(instruction);
}

module.exports = {
	createInstruction,
};
