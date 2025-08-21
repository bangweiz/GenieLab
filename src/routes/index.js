const express = require("express");

const userRouter = require("./user.routes");
const organisationRouter = require("./organisation.routes");
const authRouter = require("./auth.routes");

const router = express.Router();

router.use("/users", userRouter);
router.use("/organisations", organisationRouter);
router.use("/auth", authRouter);

module.exports = router;
