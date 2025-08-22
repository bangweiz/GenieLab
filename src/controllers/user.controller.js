const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
	await userService.createUser(req.body, req.user.organisationId);
	res.status(204);
});

const findAllUsers = catchAsync(async (req, res) => {
	const users = await userService.findAllUsers(req.user.organisationId);
	res.send(users);
});

const findUserById = catchAsync(async (req, res) => {
	const user = await userService.findUserById(req.params.userId);
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

module.exports = {
	createUser,
	findAllUsers,
	findUserById,
};
