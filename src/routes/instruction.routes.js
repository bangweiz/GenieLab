const express = require("express");
const instructionController = require("../controllers/instruction.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { ROLE } = require("../constants/auth");
const validate = require("../middlewares/validators/index");
const {
	createInstructionValidator,
	updateInstructionVersionValidator,
} = require("../middlewares/validators/instructionValidator");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get(
	"/",
	auth,
	role(ROLE.USER),
	catchAsync(instructionController.getAllInstructions),
);

router.post(
	"/",
	auth,
	role(ROLE.ADMIN),
	createInstructionValidator,
	validate,
	catchAsync(instructionController.createInstruction),
);

router.get(
	"/:instructionId",
	auth,
	role(ROLE.USER),
	catchAsync(instructionController.getInstruction),
);

router.get(
	"/:instructionId/versions/:instructionVersionId",
	auth,
	role(ROLE.USER),
	catchAsync(instructionController.getInstructionVersion),
);

router.patch(
	"/:instructionId/versions/:instructionVersionId",
	auth,
	role(ROLE.ADMIN),
	updateInstructionVersionValidator,
	validate,
	catchAsync(instructionController.updateInstructionVersion),
);

module.exports = router;
