const { body } = require("express-validator");

const createInstructionValidator = [
	body("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Name must be between 3 and 50 characters"),
	body("content")
		.notEmpty()
		.withMessage("Content is required")
		.isLength({ min: 3, max: 500 })
		.withMessage("Content must be between 3 and 500 characters"),
	body("type")
		.isIn(["personality", "guardian", "operation"])
		.withMessage("Invalid instruction type"),
];

module.exports = {
	createInstructionValidator,
};
