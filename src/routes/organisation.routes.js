const express = require("express");

const organisations = require("../controllers/organisation.controller.js");

const organisationRouter = express.Router();

organisationRouter.post("/", organisations.createOrganisation);

module.exports = organisationRouter;
