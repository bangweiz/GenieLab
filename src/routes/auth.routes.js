const express = require("express");
const { login } = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validators");
const { loginValidator } = require("../middlewares/validators/authValidator");

const router = express.Router();

router.post("/login", loginValidator, validate, login);

module.exports = router;
