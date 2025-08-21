const User = require('../models/user.model.js');

// Create and Save a new User
exports.create = async (userData) => {
    // Validate request
    if (!userData.name || !userData.email) {
        throw new Error("Name and email cannot be empty");
    }

    // Create a User
    const user = new User({
        name: userData.name,
        email: userData.email
    });

    // Save User in the database
    return await user.save();
};

// Retrieve and return all users from the database.
exports.findAll = async () => {
    return await User.find();
};

// Find a single user with a userId
exports.findOne = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found with id " + userId);
    }
    return user;
};

// Update a user identified by the userId in the request
exports.update = async (userId, userData) => {
    // Validate Request
    if (!userData.name || !userData.email) {
        throw new Error("Name and email cannot be empty");
    }

    // Find user and update it with the request body
    const user = await User.findByIdAndUpdate(userId, {
        name: userData.name,
        email: userData.email
    }, { new: true });

    if (!user) {
        throw new Error("User not found with id " + userId);
    }
    return user;
};

// Delete a user with the specified userId in the request
exports.delete = async (userId) => {
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
        throw new Error("User not found with id " + userId);
    }
    return user;
};
