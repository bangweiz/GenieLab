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
