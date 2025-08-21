const userService = require('../services/user.service.js');

// Create and Save a new User
exports.create = async (req, res) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message || "Some error occurred while creating the User." });
    }
};

// Retrieve and return all users from the database.
exports.findAll = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving users." });
    }
};

// Find a single user with a userId
exports.findOne = async (req, res) => {
    try {
        const user = await userService.findOne(req.params.userId);
        res.send(user);
    } catch (error) {
        if (error.message.includes("not found")) {
            return res.status(404).send({ message: error.message });
        }
        res.status(500).send({ message: "Error retrieving user with id " + req.params.userId });
    }
};

// Update a user identified by the userId in the request
exports.update = async (req, res) => {
    try {
        const user = await userService.update(req.params.userId, req.body);
        res.send(user);
    } catch (error) {
        if (error.message.includes("not found")) {
            return res.status(404).send({ message: error.message });
        }
        res.status(400).send({ message: error.message || "Some error occurred while updating the user." });
    }
};

// Delete a user with the specified userId in the request
exports.delete = async (req, res) => {
    try {
        await userService.delete(req.params.userId);
        res.send({ message: "User deleted successfully!" });
    } catch (error) {
        if (error.message.includes("not found")) {
            return res.status(404).send({ message: error.message });
        }
        res.status(500).send({ message: "Could not delete user with id " + req.params.userId });
    }
};
