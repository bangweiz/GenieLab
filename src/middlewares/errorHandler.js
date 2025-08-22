const GenieLabError = require("../utils/GenieLabError");
const ERROR_CODE = require("../constants/errorCode");

const errorHandler = (err, req, res, next) => {
	if (process.env.NODE_ENV !== 'test') {
		console.error(err.stack);
	}

	if (err instanceof GenieLabError) {
		return res.status(err.statusCode || 500).json(err.toResponse());
	}

	return res.status(400).json({
		success: false,
		error: {
			code: ERROR_CODE.UNKNOWN_ERROR.code,
			message: ERROR_CODE.UNKNOWN_ERROR.message,
			details: [],
		},
	});
};

module.exports = errorHandler;
