const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Organisation = require("../models/organisation.model.js");
const User = require("../models/user.model.js");
const userMapper = require("../mappers/user.mapper");
const GenieLabError = require("../utils/GenieLabError");
const ERROR_CODE = require("../constants/errorCode");

const SALT_RUN = 10;

async function createOrganisationAndRootUser({
	organisationName,
	username,
	email,
	password,
}) {
	try {
		await checkOrganisationNameExists(organisationName);

		// Create an Organisation
		const organisation = new Organisation({
			name: organisationName,
		});

		// Save Organisation in the database
		const savedOrganisation = await organisation.save();

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
		const savedUser = await user.save();

		return {
			organisation: savedOrganisation,
			user: userMapper.entityToInfo(savedUser),
		};
	} catch (error) {
		throw error;
	}
}

async function checkOrganisationNameExists(organisationName) {
	const organisation = await Organisation.findOne({ name: organisationName });
	if (organisation) {
		throw new GenieLabError(
			ERROR_CODE.ORG_NAME_EXIST.code,
			ERROR_CODE.ORG_NAME_EXIST.message,
		);
	}
}

module.exports = {
	createOrganisationAndRootUser,
};
