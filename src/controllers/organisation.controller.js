const organisationService = require("../services/organisation.service.js");
const catchAsync = require("../utils/catchAsync");

const createOrganisation = catchAsync(async (req, res) => {
	const result = await organisationService.createOrganisationAndRootUser(
		req.body,
	);
	res.status(201).send(result);
});

module.exports = {
	createOrganisation,
};
