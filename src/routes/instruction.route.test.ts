import { describe, it, expect } from "bun:test";
import app from "../index";

describe("Instructions API", () => {
	it("should create a new instruction", async () => {
		const organisationId = "123";
		const instructionData = {
			name: "Test Instruction",
			description: "Test Description",
			type: "Personality",
			content: "Test Content",
		};

		const request = new Request(
			`http://localhost/v1/organisation/${organisationId}/instructions`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(instructionData),
			},
		);

		const response = await app.fetch(request);
		const responseBody = await response.json();

		expect(response.status).toBe(201);
		expect(responseBody.name).toBe(instructionData.name);
		expect(responseBody.description).toBe(instructionData.description);
		expect(responseBody.type).toBe(instructionData.type);
		expect(responseBody.content).toBe(instructionData.content);
	});
});
