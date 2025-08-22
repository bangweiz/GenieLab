const express = require("express");

const organisations = require("../controllers/organisation.controller");
const validate = require("../middlewares/validators/index");
const {
	createOrganisationValidator,
} = require("../middlewares/validators/organisationValidator");
const catchAsync = require("../utils/catchAsync");

const organisationRouter = express.Router();

organisationRouter.post(
	"/",
	createOrganisationValidator,
	validate,
	catchAsync(organisations.createOrganisation),
);

module.exports = organisationRouter;
