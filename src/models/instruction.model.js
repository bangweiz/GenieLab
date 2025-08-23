const mongoose = require("mongoose");

const InstructionSchema = new mongoose.Schema(
	{
		organisation_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organisation",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["personality", "guardian", "operation"],
			required: true,
		},
		latestVersion: {
			type: Number,
			required: true,
			default: 1,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Instruction", InstructionSchema);
