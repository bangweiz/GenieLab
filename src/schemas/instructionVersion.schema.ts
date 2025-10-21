import mongoose from "mongoose";

const instructionVersionSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		version: {
			type: Number,
			required: true,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Instruction",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const InstructionVersion = mongoose.model(
	"InstructionVersion",
	instructionVersionSchema,
);

export default InstructionVersion;
