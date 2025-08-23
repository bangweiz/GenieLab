const mongoose = require("mongoose");

const InstructionSchema = new mongoose.Schema(
	{
		instruction_id: {
			type: String,
			required: true,
			unique: true,
		},
		version: {
			type: Number,
			required: true,
			default: 1,
		},
		name: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["personality", "guardian", "operation"],
			required: true,
		},
		organisation_id: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Instruction", InstructionSchema);
