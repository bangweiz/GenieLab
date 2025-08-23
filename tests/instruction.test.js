const request = require("supertest");
const app = require("../src/app");
const Organisation = require("../src/models/organisation.model");
const User = require("../src/models/user.model");
const Instruction = require("../src/models/instruction.model");
const InstructionVersion = require("../src/models/instruction_version.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

describe("Instruction endpoints", () => {
	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});

	describe("POST /api/instructions", () => {
		it("should create a new instruction and an instruction version", async () => {
			const org = await new Organisation({ name: "Test Org" }).save();
			const organisationId = org._id.toString();

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);

			const user = new User({
				username: "testuser",
				email: "testuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "admin",
			});
			await user.save();

			const resLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "testuser@test.com", password: "password" });
			const token = resLogin.body.token;

			const newInstruction = {
				name: "Test Instruction",
				content: "This is a test instruction.",
				type: "personality",
				description: "This is a test description.",
			};

			const res = await request(app)
				.post("/api/instructions")
				.set("Authorization", `Bearer ${token}`)
				.send(newInstruction);

			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty("instructionId");
			expect(res.body.name).toBe(newInstruction.name);
			expect(res.body.content).toBe(newInstruction.content);
			expect(res.body.type).toBe(newInstruction.type);
			expect(res.body.description).toBe(newInstruction.description);
			expect(res.body.version).toBe(1);

			// Verify instruction and instruction version are in the database
			const instruction = await Instruction.findById(res.body.instructionId);
			expect(instruction).not.toBeNull();
			expect(instruction.latestVersion).toBe(1);

			const instructionVersion = await InstructionVersion.findOne({
				instruction_id: instruction._id,
			});
			expect(instructionVersion).not.toBeNull();
			expect(instructionVersion.version).toBe(1);
			expect(instructionVersion.content).toBe(newInstruction.content);
		});
	});
});
