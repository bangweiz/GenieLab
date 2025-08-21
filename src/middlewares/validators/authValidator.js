const { body } = require("express-validator");

const loginValidator = [
	body("email").isEmail().withMessage("Email must be a valid email address"),
	body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
	loginValidator,
};
