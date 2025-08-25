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

/**
 * Get all instructions
 * @param {import('express').Request<any, any, any> & { user: import('../types/user').UserInfo }} req - The request object
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 * */
async function getAllInstructions(req, res) {
	const instructions = await instructionService.getAllInstructions(
		req.user.organisationId,
	);
	res.status(200).json(instructions);
}

/**
 * Get a specific version of an instruction
 * @param {import('express').Request<{ instructionId: string, instructionVersionId: string }, any, any> & { user: import('../types/user').UserInfo }} req - The request object
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 * */
async function getInstructionVersion(req, res) {
	const instructionVersion = await instructionService.getInstructionVersion(
		req.params.instructionId,
		req.params.instructionVersionId,
		req.user.organisationId,
	);
	res.status(200).json(instructionVersion);
}

/**
 * Update a specific version of an instruction
 * @param {import('express').Request<{ instructionId: string, instructionVersionId: string }, any, import('../types/instruction').UpdateInstructionVersion> & { user: import('../types/user').UserInfo }} req - The request object
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 * */
async function updateInstructionVersion(req, res) {
	const instructionVersion = await instructionService.updateInstructionVersion(
		req.params.instructionId,
		req.params.instructionVersionId,
		req.user.organisationId,
		req.body,
	);
	res.status(200).json(instructionVersion);
}

module.exports = {
	createInstruction,
	getInstruction,
	getAllInstructions,
	getInstructionVersion,
	updateInstructionVersion,
};
