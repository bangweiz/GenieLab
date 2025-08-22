const organisationService = require("../services/organisation.service");

/**
 * Create a new organisation with a root user
 * @param {import('express').Request<any, any, import('../types/organisation').CreateOrganisation>} req - The request object with CreateOrganisation body
 * @param {import('express').Response} res - The response object
 * @returns {Promise<void>}
 */
async function createOrganisation(req, res) {
	const result = await organisationService.createOrganisationAndRootUser(
		req.body,
	);
	res.status(201).send(result);
}

module.exports = {
	createOrganisation,
};
