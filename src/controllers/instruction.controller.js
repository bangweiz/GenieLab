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

/**
 * Get an instruction by ID
 * @param {import('express').Request<{ instructionId: string }, any, any> & { user: import('../types/user').UserInfo }} req - The request object
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function getInstruction(req, res) {
	const instruction = await instructionService.getInstruction(
		req.params.instructionId,
		req.user.organisationId,
	);
	res.status(200).json(instruction);
}

module.exports = {
	createInstruction,
	getInstruction,
};
