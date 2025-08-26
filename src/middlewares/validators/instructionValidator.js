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
		.isLength({ min: 3, max: 5000 })
		.withMessage("Content must be between 3 and 5000 characters"),
	body("type")
		.isIn(["personality", "guardian", "operation"])
		.withMessage("Invalid instruction type"),
	body("description")
		.optional()
		.isString()
		.withMessage("Description must be a string")
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
];

const updateInstructionVersionValidator = [
	body("description")
		.notEmpty()
		.withMessage("Description is required")
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
];

const createInstructionVersionValidator = [
	body("content")
		.notEmpty()
		.withMessage("Content is required")
		.isLength({ min: 3, max: 5000 })
		.withMessage("Content must be between 3 and 5000 characters"),
	body("description")
		.optional()
		.isString()
		.withMessage("Description must be a string")
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
];

module.exports = {
	createInstructionValidator,
	updateInstructionVersionValidator,
	createInstructionVersionValidator,
};
