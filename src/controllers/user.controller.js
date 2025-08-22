const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

/**
 * Create a new user
 * @param {import('express').Request<any, any, import('../types/user').CreateUser> & { user: import('../types/user').UserInfo }} req - The request object with CreateUser body
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function createUser(req, res) {
	const user = await userService.createUser(req.body, req.user.organisationId);
	res.status(201).send(user);
}

/**
 * Get all users in the organisation
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function findAllUsers(req, res) {
	const users = await userService.findAllUsers(req.user.organisationId);
	res.send(users);
}

/**
 * Find a user by ID
 * @param {import('express').Request<{ userId: string }, any, any>} req - The request object with userId parameter
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function findUserById(req, res) {
	const user = await userService.findUserById(req.params.userId);
	res.send(user);
}

module.exports = {
	createUser,
	findAllUsers,
	findUserById,
};
