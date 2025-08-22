const express = require("express");

const users = require("../controllers/user.controller.js");
const auth = require("../middlewares/auth.js");
const role = require("../middlewares/role.js");
const { ROLE } = require("../constants/auth");

const userRouter = express.Router();

userRouter.get("/", auth, role(ROLE.ROOT), users.findAllUsers);
userRouter.post("/", auth, role(ROLE.ROOT), users.createUser);
userRouter.get("/:userId", auth, role(ROLE.ROOT), users.findUserById);

module.exports = userRouter;
