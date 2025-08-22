const User = require("../models/user.model.js");

async function createUser(userData) {
	// Validate request
	if (!userData.name || !userData.email) {
		throw new Error("Name and email cannot be empty");
	}

	// Create a User
	const user = new User({
		name: userData.name,
		email: userData.email,
	});

	// Save User in the database
	return await user.save();
}

async function findAllUsers(organisation_id) {
	return await User.find({ organisation_id });
}

async function findUserById(userId) {
	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found with id " + userId);
	}
	return user;
}

module.exports = {
	createUser,
	findAllUsers,
	findUserById,
};
