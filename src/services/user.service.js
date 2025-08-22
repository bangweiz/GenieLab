const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const userMapper = require("../mappers/user.mapper");
const ERROR_CODE = require("../constants/errorCode");
const GenieLabError = require("../utils/GenieLabError");

const SALT_RUN = 10;

async function createUser(userData) {
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
			organisation_id: userData.organisation_id,
		});

		await user.save();

		return user;
	} catch (error) {
		throw error;
	}
}

async function findAllUsers(organisation_id) {
	const users = await User.find({ organisation_id });
	return users.map(userMapper.entityToInfo);
}

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

async function checkUsernameExist(username) {
	const user = await User.findOne({ username });
	if (user) {
		throw new GenieLabError(
			ERROR_CODE.USER_EXIST.code,
			ERROR_CODE.USER_EXIST.message,
		);
	}
}

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
