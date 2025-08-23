const mongoose = require("mongoose");

const InstructionVersionSchema = new mongoose.Schema(
	{
		instruction_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Instruction",
			required: true,
		},
		version: {
			type: Number,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("InstructionVersion", InstructionVersionSchema);
