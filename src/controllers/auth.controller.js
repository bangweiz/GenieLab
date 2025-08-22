const authService = require("../services/auth.service");

/**
 * Handle user login
 * @param {import('express').Request<any, any, import('../types/user').UserLogin>} req - The request object with UserLogin body
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function login(req, res) {
	const token = await authService.login(req.body);
	res.json({ token });
}

module.exports = {
	login,
};
