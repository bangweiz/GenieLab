const express = require("express");
const instructionController = require("../controllers/instruction.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { ROLE } = require("../constants/auth");
const {
	createInstructionValidator,
} = require("../middlewares/validators/instructionValidator");

const router = express.Router();

router.post(
	"/",
	auth,
	role(ROLE.ADMIN),
	createInstructionValidator,
	instructionController.createInstruction,
);

module.exports = router;
