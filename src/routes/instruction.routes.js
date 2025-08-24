const express = require("express");
const instructionController = require("../controllers/instruction.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { ROLE } = require("../constants/auth");
const validate = require("../middlewares/validators/index");
const {
	createInstructionValidator,
	updateInstructionValidator,
} = require("../middlewares/validators/instructionValidator");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post(
	"/",
	auth,
	role(ROLE.ADMIN),
	createInstructionValidator,
	validate,
	catchAsync(instructionController.createInstruction),
);

router.put(
	"/:instructionId",
	auth,
	role(ROLE.ADMIN),
	updateInstructionValidator,
	validate,
	catchAsync(instructionController.updateInstruction),
);

module.exports = router;
