const instructionService = require("../services/instruction.service");
const catchAsync = require("../utils/catchAsync");

const createInstruction = catchAsync(async (req, res) => {
	const instruction = await instructionService.createInstruction(
		req.body,
		req.user.organisation_id,
	);
	res.status(201).json(instruction);
});

module.exports = {
	createInstruction,
};
