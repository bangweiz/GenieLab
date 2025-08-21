const userService = require("../services/user.service.js");
const { models } = require("mongoose");

async function createUser(req, res) {
	try {
		const user = await userService.createUser(req.body);
		res.status(201).send(user);
	} catch (error) {
		res.status(400).send({
			message: error.message || "Some error occurred while creating the User.",
		});
	}
}

async function findAllUsers(req, res) {
	try {
		const users = await userService.findAllUsers();
		res.send(users);
	} catch (error) {
		res.status(500).send({
			message: error.message || "Some error occurred while retrieving users.",
		});
	}
}

async function findUserById(req, res) {
	try {
		const user = await userService.findUserById(req.params.userId);
		res.send(user);
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).send({ message: error.message });
		}
		res
			.status(500)
			.send({ message: "Error retrieving user with id " + req.params.userId });
	}
}

module.exports = {
	createUser,
	findAllUsers,
	findUserById,
};
