const express = require("express");

const users = require("../controllers/user.controller.js");
const auth = require("../middlewares/auth.js");
const role = require("../middlewares/role.js");

const userRouter = express.Router();

userRouter.get("/", auth, role("root"), users.findAllUsers);
userRouter.post("/", auth, role("root"), users.createUser);
userRouter.get("/:userId", auth, role("root"), users.findUserById);

module.exports = userRouter;
