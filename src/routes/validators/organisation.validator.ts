import { validator } from "hono/validator";
import { HTTPException } from "hono/http-exception";

import { postOrganisationBody } from "../../types/gen/endpoints/genieLabAPI";

export const organisationValidator = validator("json", (value, c) => {
	const parsed = postOrganisationBody.safeParse(value);
	if (!parsed.success) {
		throw new HTTPException(400, { message: "Invalid input" });
	}
	return parsed.data;
});
