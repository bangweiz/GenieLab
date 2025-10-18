import { HTTPException } from "hono/http-exception";

import Organisation from "../schemas/organisation.schema";
import { OrganisationResponse } from "../types/gen/schemas";

export async function createOrganisation(
	name: string,
	phone: string,
	address: string,
): Promise<OrganisationResponse> {
	const existOrganisation = await Organisation.exists({ name });
	if (existOrganisation !== null) {
		throw new HTTPException(409, { message: "Conflicts" });
	}
	const organisation = new Organisation({
		name,
		phone,
		address,
	});
	const savedOrganisation = await organisation.save();
	return {
		id: savedOrganisation._id.toString(),
		name: savedOrganisation.name,
		phone: savedOrganisation.phone,
		address: savedOrganisation.address,
	};
}
