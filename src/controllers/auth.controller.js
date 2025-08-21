const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const token = await authService.login(email, password);
	res.json({ token });
});

module.exports = {
	login,
};
