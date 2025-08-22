const express = require("express");

const users = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { ROLE } = require("../constants/auth");
const {
	createUserValidator,
} = require("../middlewares/validators/userValidator");
const validate = require("../middlewares/validators");
const catchAsync = require("../utils/catchAsync");

const userRouter = express.Router();

userRouter.get("/", auth, role(ROLE.ROOT), catchAsync(users.findAllUsers));
userRouter.post(
	"/",
	auth,
	role(ROLE.ROOT),
	createUserValidator,
	validate,
	catchAsync(users.createUser),
);
userRouter.get(
	"/:userId",
	auth,
	role(ROLE.ROOT),
	catchAsync(users.findUserById),
);

module.exports = userRouter;
