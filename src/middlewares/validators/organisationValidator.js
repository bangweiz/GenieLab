const { body } = require("express-validator");

const createOrganisationValidator = [
	body("organisationName")
		.notEmpty()
		.withMessage("Organisation name cannot be empty")
		.isLength({ min: 1, max: 100 })
		.withMessage("Organisation name cannot have more than 100 characters"),
	body("username")
		.notEmpty()
		.withMessage("Username cannot be empty")
		.isLength({ min: 1, max: 50 })
		.withMessage("Username name cannot have more than 100 characters"),
	body("email")
		.notEmpty()
		.withMessage("Email cannot be empty")
		.isEmail()
		.withMessage("Must be a valid email address")
		.normalizeEmail(),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

module.exports = {
	createOrganisationValidator,
};
