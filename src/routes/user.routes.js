const express = require("express");

const users = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { ROLE } = require("../constants/auth");
const {
	createUserValidator,
} = require("../middlewares/validators/userValidator");
const validate = require("../middlewares/validators");

const userRouter = express.Router();

userRouter.get("/", auth, role(ROLE.ROOT), users.findAllUsers);
userRouter.post(
	"/",
	auth,
	role(ROLE.ROOT),
	...createUserValidator,
	validate,
	users.createUser,
);
userRouter.get("/:userId", auth, role(ROLE.ROOT), users.findUserById);

module.exports = userRouter;
