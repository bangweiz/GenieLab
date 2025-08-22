const jwt = require("jsonwebtoken");
const GenieLabError = require("../utils/GenieLabError");
const ERROR_CODE = require("../constants/errorCode");

function auth(req, res, next) {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		throw new GenieLabError(
			ERROR_CODE.UNAUTHENTICATED.code,
			ERROR_CODE.UNAUTHENTICATED.message,
			[],
			401,
		);
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "defaultSecret",
		);
		req.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = auth;
