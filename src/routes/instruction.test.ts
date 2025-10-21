import { describe, test, expect, mock } from "bun:test";
import app from "../index";
import * as instructionService from "../services/instruction.service";

describe("Instruction API", () => {
	test("should get an instruction by id", async () => {
		const instructionId = "507f1f77bcf86cd799439011";
		const organisationId = "507f1f77bcf86cd799439012";

		const mockedInstruction = {
			id: instructionId,
			name: "test",
			description: "test",
			type: "Personality",
			versions: [
				{
					id: "507f1f77bcf86cd799439013",
					version: 1,
					content: "test",
				},
			],
		};

		mock.module("../services/instruction.service", () => ({
			getInstruction: () => Promise.resolve(mockedInstruction),
		}));

		const response = await app.request(
			`/v1/organisations/${organisationId}/instructions/${instructionId}`,
			{
				method: "GET",
			},
		);

		const instruction = await response.json();

		expect(response.status).toBe(200);
		expect(instruction).toEqual(mockedInstruction);
	});
});
