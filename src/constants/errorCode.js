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
	USER_NOT_FOUND: {
		code: "USER_NOT_FOUND",
		message: "User not found",
	},
	INVALID_CREDENTIALS: {
		code: "INVALID_CREDENTIALS",
		message: "Invalid credentials",
	},
	UNAUTHENTICATED: {
		code: "UNAUTHENTICATED",
		message: "Unauthenticated",
	},
	FORBIDDEN: {
		code: "FORBIDDEN",
		message: "No permission",
	},
	USER_EXIST: {
		code: "USER_EXIST",
		message: "User already exists",
	},
	INSTRUCTION_NAME_EXIST: {
		code: "INSTRUCTION_NAME_EXIST",
		message: "Instruction name already exists",
	}
};

module.exports = ERROR_CODE;
