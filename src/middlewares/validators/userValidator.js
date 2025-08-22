const { body } = require("express-validator");
const { ROLE } = require("../../constants/auth");

const createUserValidator = [
	body("email").isEmail().withMessage("Email is required"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	body("username")
		.isLength({ min: 1, max: 50 })
		.withMessage("Username must be between 1 and 50 characters long"),
	body("role")
		.isIn([ROLE.ADMIN, ROLE.USER])
		.withMessage("Role must be either admin or user"),
];

module.exports = {
	createUserValidator,
};
