import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	},
);

const Organisation = mongoose.model("Organisation", organisationSchema);

export default Organisation;
