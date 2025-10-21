import mongoose from "mongoose";
import { CreateInstructionRequestType } from "../types/gen/schemas";

const instructionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minLength: 1,
			maxLength: 100,
		},
		description: {
			type: String,
			required: true,
			minLength: 1,
			maxLength: 1000,
		},
		type: {
			type: String,
			required: true,
			enum: [
				CreateInstructionRequestType.Guardian,
				CreateInstructionRequestType.Personality,
				CreateInstructionRequestType.Procedure,
			],
		},
		latestVersion: {
			type: Number,
			required: true,
		},
		organisation: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Organisation",
		},
	},
	{
		timestamps: true,
	},
);

const Instruction = mongoose.model("Instruction", instructionSchema);

export default Instruction;
