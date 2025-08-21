const userService = require("../services/user.service.js");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).send(user);
});

const findAllUsers = catchAsync(async (req, res) => {
  const users = await userService.findAllUsers();
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
