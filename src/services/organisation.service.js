const mongoose = require("mongoose");
const Organisation = require("../models/organisation.model.js");
const User = require("../models/user.model.js");

async function createOrganisationAndRootUser(orgData) {
  // Validate request
  if (!orgData.org_name || !orgData.username || !orgData.email || !orgData.password) {
    throw new Error("Organisation name, username, email, and password cannot be empty");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create an Organisation
    const organisation = new Organisation({
      name: orgData.org_name,
    });

    // Save Organisation in the database
    const savedOrganisation = await organisation.save({ session });

    // Create a User
    const user = new User({
      username: orgData.username,
      email: orgData.email,
      password: orgData.password,
      organisation_id: savedOrganisation._id,
      role: 'root',
    });

    // Save User in the database
    const savedUser = await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { organisation: savedOrganisation, user: savedUser };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  createOrganisationAndRootUser,
};
