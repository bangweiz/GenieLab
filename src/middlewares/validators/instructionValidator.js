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

const updateInstructionValidator = [
	body().custom((value) => {
		if (Object.keys(value).length === 0) {
			return false;
		}
		const allowedFields = ["content", "description"];
		return Object.keys(value).every((field) => allowedFields.includes(field));
	}),
	body("content")
		.optional()
		.isLength({ min: 3, max: 5000 })
		.withMessage("Content must be between 3 and 5000 characters"),
	body("description")
		.optional()
		.isString()
		.withMessage("Description must be a string")
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
];

const updateInstructionVersionValidator = [
	body().custom((value) => {
		if (Object.keys(value).length === 0) {
			return false;
		}
		const allowedFields = ["description"];
		return Object.keys(value).every((field) => allowedFields.includes(field));
	}),
	body("description")
		.isString()
		.withMessage("Description must be a string")
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
];

module.exports = {
	createInstructionValidator,
	updateInstructionValidator,
	updateInstructionVersionValidator,
};
