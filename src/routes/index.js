const express = require("express");

const userRouter = require("./user.routes");
const organisationRouter = require("./organisation.routes");
const authRouter = require("./auth.routes");
const instructionRouter = require("./instruction.routes");

const router = express.Router();

router.use("/users", userRouter);
router.use("/organisations", organisationRouter);
router.use("/auth", authRouter);
router.use("/instructions", instructionRouter);

module.exports = router;
