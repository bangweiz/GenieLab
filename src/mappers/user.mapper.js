/**
 * Convert a user model entity to a UserInfo object
 * @param {import("../types/user").UserEntity} userModel
 * @returns {import("../types/user").UserInfo} The user information object
 */
function entityToInfo(userModel) {
	return {
		id: userModel._id,
		username: userModel.username,
		email: userModel.email,
		organisationId: userModel.organisation_id,
		role: userModel.role,
	};
}

module.exports = {
	entityToInfo,
};
