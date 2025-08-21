const organisationService = require("../services/organisation.service.js");

async function createOrganisation(req, res) {
	try {
		const result = await organisationService.createOrganisationAndRootUser(
			req.body,
		);
		res.status(201).send(result);
	} catch (error) {
		res.status(400).send({
			message:
				error.message || "Some error occurred while creating the Organisation.",
		});
	}
}

module.exports = {
	createOrganisation,
};
