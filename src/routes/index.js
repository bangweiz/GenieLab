const express = require("express");

const userRouter = require("./user.routes");
const organisationRouter = require("./organisation.routes");

const router = express.Router();

router.use("/users", userRouter);
router.use("/organisations", organisationRouter);

module.exports = router;
