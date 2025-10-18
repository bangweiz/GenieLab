import mongoose from "mongoose";
import { Role } from "../constants/auth";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
			enum: [Role.User, Role.Admin, Role.Root],
		},
		organisation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organisation",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", userSchema);

export default User;
