const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const userMapper = require("../mappers/user.mapper");
const ERROR_CODE = require("../constants/errorCode");
const GenieLabError = require("../utils/GenieLabError");
const { SALT_RUN } = require("../constants/auth");

/**
 * Create a new user
 * @param {import("../types/user").CreateUser} userData
 * @param {string} organisationId
 * @returns {Promise<import("../types/user").UserInfo>}
 */
async function createUser(userData, organisationId) {
	try {
		await checkUsernameExist(userData.username);
		await checkEmailExist(userData.email);

		const salt = bcrypt.genSaltSync(SALT_RUN);
		const hashedPassword = bcrypt.hashSync(userData.password, salt);

		const user = new User({
			username: userData.username,
			email: userData.email,
			password: hashedPassword,
			role: userData.role,
			organisation_id: organisationId,
		});

		const savedUser = await user.save();

		return userMapper.entityToInfo(savedUser);
	} catch (error) {
		throw error;
	}
}

/**
 * List all users in an organisation
 * @param {string} organisation_id
 * @returns {Promise<Array<import("../types/user").UserInfo>>}
 */
async function findAllUsers(organisation_id) {
	const users = await User.find({ organisation_id });
	return users.map(userMapper.entityToInfo);
}

/**
 * Find user by id
 * @param {string} userId
 * @returns {Promise<import("../types/user").UserInfo>}
 */
async function findUserById(userId) {
	const user = await User.findById(userId);
	if (!user) {
		throw new GenieLabError(
			ERROR_CODE.USER_NOT_FOUND.code,
			ERROR_CODE.USER_NOT_FOUND.message,
			[],
			404,
		);
	}
	return userMapper.entityToInfo(user);
}

/**
 * Check if username exists
 * @param {string} username
 * @returns {Promise<boolean>}
 */
async function checkUsernameExist(username) {
	const user = await User.findOne({ username });
	if (user) {
		throw new GenieLabError(
			ERROR_CODE.USER_EXIST.code,
			ERROR_CODE.USER_EXIST.message,
		);
	}
}

/**
 * Check email exists
 * @param {string} email
 * @returns {Promise<void>}
 */
async function checkEmailExist(email) {
	const user = await User.findOne({ email });
	if (user) {
		throw new GenieLabError(
			ERROR_CODE.USER_EXIST.code,
			ERROR_CODE.USER_EXIST.message,
		);
	}
}

module.exports = {
	createUser,
	findAllUsers,
	findUserById,
};
