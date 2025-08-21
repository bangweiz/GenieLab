class GenieLabError extends Error {
	constructor(code, message, details = [], statusCode = 400) {
		super(message);
		this.code = code;
		this.details = details;
		this.statusCode = statusCode;
	}

	toResponse() {
		return {
			success: false,
			error: {
				code: this.code,
				message: this.message,
				details: this.details,
			},
		};
	}
}

module.exports = GenieLabError;
