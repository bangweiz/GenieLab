const express = require("express");

const users = require("../controllers/user.controller.js");

const userRouter = express.Router();

userRouter.get("/", users.findAllUsers);
userRouter.post("/", users.createUser);
userRouter.get("/:userId", users.findUserById);

module.exports = userRouter;
