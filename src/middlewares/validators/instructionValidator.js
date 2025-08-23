const { body, validationResult } = require("express-validator");
const GenieLabError = require("../../utils/GenieLabError");
const ERROR_CODE = require("../../constants/errorCode");

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new GenieLabError(
				ERROR_CODE.VALIDATION_ERROR.code,
				ERROR_CODE.VALIDATION_ERROR.message,
				errors.array().map((e) => e.msg),
				400,
			),
		);
	}
	next();
};

const createInstructionValidator = [
	body("name").notEmpty().withMessage("Name is required"),
	body("content").notEmpty().withMessage("Content is required"),
	body("type")
		.isIn(["personality", "guardian", "operation"])
		.withMessage("Invalid instruction type"),
	validate,
];

module.exports = {
	createInstructionValidator,
};
