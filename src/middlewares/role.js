const GenieLabError = require("../utils/GenieLabError");
const ERROR_CODE = require("../constants/errorCode");

function role(role) {
	return function (req, res, next) {
		if (!req.user || req.user.role !== role) {
			throw new GenieLabError(
				ERROR_CODE.FORBIDDEN.code,
				ERROR_CODE.FORBIDDEN.message,
				[],
				403,
			);
		}
		next();
	};
}

module.exports = role;
