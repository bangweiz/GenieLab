const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT_RUN } = require("../constants/auth");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		organisation_id: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["root", "admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true
	},
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(SALT_RUN);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

module.exports = mongoose.model("User", UserSchema);
