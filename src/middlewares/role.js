const GenieLabError = require("../utils/GenieLabError");
const ERROR_CODE = require("../constants/errorCode");
const { ROLE } = require("../constants/auth");

/**
 * Middleware to check if user has the required role or higher
 * Role hierarchy: root > admin > user
 * - If requires user, then all roles are ok
 * - If requires admin, then root and admin are ok
 * - If requires root, then only root role is ok
 * @param {string} requiredRole - The required role (one of ROLE.USER, ROLE.ADMIN, ROLE.ROOT)
 * @returns {Function} Express middleware function
 */
function role(requiredRole) {
	return function (req, res, next) {
		if (!req.user) {
			throw new GenieLabError(
				ERROR_CODE.FORBIDDEN.code,
				ERROR_CODE.FORBIDDEN.message,
				[],
				403,
			);
		}

		const userRole = req.user.role;
		
		// Check role hierarchy
		let hasPermission = false;
		switch (requiredRole) {
			case ROLE.USER:
				hasPermission = [ROLE.USER, ROLE.ADMIN, ROLE.ROOT].includes(userRole);
				break;
			case ROLE.ADMIN:
				hasPermission = [ROLE.ADMIN, ROLE.ROOT].includes(userRole);
				break;
			case ROLE.ROOT:
				hasPermission = userRole === ROLE.ROOT;
				break;
			default:
				hasPermission = false;
		}

		if (!hasPermission) {
			throw new GenieLabError(
				ERROR_CODE.FORBIDDEN.code,
				ERROR_CODE.FORBIDDEN.message,
				[],
				403,
			);
		}
		
		next();
	};
}

module.exports = role;