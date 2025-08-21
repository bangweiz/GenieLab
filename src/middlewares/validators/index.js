const { validationResult } = require("express-validator");
const GenieLabError = require("../../utils/GenieLabError");
const ERROR_CODE = require("../../constants/errorCode");

function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new GenieLabError(
			ERROR_CODE.BAD_REQUEST_BODY.code,
			ERROR_CODE.BAD_REQUEST_BODY.message,
			errors.array(),
		);
	}
	next();
}

module.exports = validate;
