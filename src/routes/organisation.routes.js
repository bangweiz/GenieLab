const express = require("express");

const organisations = require("../controllers/organisation.controller.js");
const validate = require("../middlewares/validators/index");
const {
	createOrganisationValidator,
} = require("../middlewares/validators/organisationValidator");

const organisationRouter = express.Router();

organisationRouter.post(
	"/",
	createOrganisationValidator,
	validate,
	organisations.createOrganisation,
);

module.exports = organisationRouter;
