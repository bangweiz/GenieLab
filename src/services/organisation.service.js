const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Organisation = require("../models/organisation.model.js");
const User = require("../models/user.model.js");
const { SALT_RUN } = require("../constants/auth");

async function createOrganisationAndRootUser({
	organisationName,
	username,
	email,
	password,
}) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Create an Organisation
		const organisation = new Organisation({
			name: organisationName,
		});

		// Save Organisation in the database
		const savedOrganisation = await organisation.save({ session });

		// Create a User
		const salt = bcrypt.genSaltSync(SALT_RUN);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const user = new User({
			username,
			email,
			password: hashedPassword,
			organisation_id: savedOrganisation._id,
			role: "root",
		});

		// Save User in the database
		const savedUser = await user.save({ session });

		await session.commitTransaction();
		await session.endSession();

		return {
			organisation: savedOrganisation,
			user: { username, email, role: "root" },
		};
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
}

module.exports = {
	createOrganisationAndRootUser,
};
