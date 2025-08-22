const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const GenieLabError = require("../utils/GenieLabError");
const { TOKEN_EXPIRATION } = require("../constants/auth");
const ERROR_CODE = require("../constants/errorCode");
const userMapper = require("../mappers/user.mapper");

async function login(email, password) {
	const user = await User.findOne({ email });
	if (!user) {
		throw new GenieLabError(
			ERROR_CODE.USER_NOT_FOUND.code,
			ERROR_CODE.USER_NOT_FOUND.message,
			[],
			404,
		);
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new GenieLabError(
			ERROR_CODE.INVALID_CREDENTIALS.code,
			ERROR_CODE.INVALID_CREDENTIALS.message,
			[],
			401,
		);
	}

	const token = jwt.sign(
		userMapper.entityToInfo(user),
		process.env.JWT_SECRET || "defaultSecret",
		{ expiresIn: TOKEN_EXPIRATION },
	);

	return token;
}

module.exports = {
	login,
};
