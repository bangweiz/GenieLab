const express = require("express");
const auth = require("../controllers/auth.controller");
const validate = require("../middlewares/validators");
const { loginValidator } = require("../middlewares/validators/authValidator");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post("/login", loginValidator, validate, catchAsync(auth.login));

module.exports = router;
