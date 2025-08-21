const ERROR_CODE = {
	UNKNOWN_ERROR: {
		code: "UNKNOWN_ERROR",
		message: "Unknown error happened",
	},
	BAD_REQUEST_BODY: {
		code: "BAD_REQUEST_BODY",
		message: "Request body is invalid",
	},
	ORG_NAME_EXIST: {
		code: "ORG_NAME_EXIST",
		message: "Organisation name exists",
	},
	DB_ERROR: {
		code: "DB_ERROR",
		message: "Something wrong with DB",
	},
};

module.exports = ERROR_CODE;
