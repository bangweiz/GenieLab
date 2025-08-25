const request = require("supertest");
const app = require("../src/app");
const Organisation = require("../src/models/organisation.model");
const User = require("../src/models/user.model");
const Instruction = require("../src/models/instruction.model");
const InstructionVersion = require("../src/models/instructionVersion.model");
const bcrypt = require("bcryptjs");

describe("Instruction endpoints", () => {
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
			expect(res.body.type).toBe(newInstruction.type);
			expect(res.body.versions[0].content).toBe(newInstruction.content);
			expect(res.body.versions[0].description).toBe(newInstruction.description);
			expect(res.body.versions[0].version).toBe(1);

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

	describe("GET /api/instructions/:instructionId", () => {
		let token, instruction;

		beforeEach(async () => {
			const org = await new Organisation({ name: "Test Org" }).save();
			const organisationId = org._id.toString();

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);

			const user = new User({
				username: "testuser",
				email: "testuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "user",
			});
			await user.save();

			const resLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "testuser@test.com", password: "password" });
			token = resLogin.body.token;

			const newInstruction = {
				name: "Test Instruction",
				content: "This is a test instruction.",
				type: "personality",
				description: "This is a test description.",
			};

			// We need an admin to create the instruction first
			const adminUser = new User({
				username: "adminuser",
				email: "adminuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "admin",
			});
			await adminUser.save();
			const resAdminLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "adminuser@test.com", password: "password" });
			const adminToken = resAdminLogin.body.token;

			const res = await request(app)
				.post("/api/instructions")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(newInstruction);
			instruction = res.body;
		});

		it("should return the instruction with all its versions", async () => {
			const res = await request(app)
				.get(`/api/instructions/${instruction.instructionId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("instructionId");
			expect(res.body.name).toBe(instruction.name);
			expect(res.body.versions.length).toBe(1);
			expect(res.body.versions[0].version).toBe(1);
		});

		it("should return 404 if instruction not found", async () => {
			const res = await request(app)
				.get(`/api/instructions/60f6e1b9b5f3c1a9c8b4b6d4`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(404);
		});

		it("should return 404 if user from another org tries to access", async () => {
			// Create another org and user
			const anotherOrg = await new Organisation({ name: "Another Org" }).save();
			const anotherOrganisationId = anotherOrg._id.toString();
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);
			const anotherUser = new User({
				username: "anotheruser",
				email: "anotheruser@test.com",
				password: hashedPassword,
				organisation_id: anotherOrganisationId,
				role: "user",
			});
			await anotherUser.save();
			const resAnotherLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "anotheruser@test.com", password: "password" });
			const anotherToken = resAnotherLogin.body.token;

			const res = await request(app)
				.get(`/api/instructions/${instruction.instructionId}`)
				.set("Authorization", `Bearer ${anotherToken}`);

			expect(res.statusCode).toEqual(404);
		});
	});

	describe("GET /api/instructions/:instructionId/versions/:instructionVersionId", () => {
		let token,
			instruction,
			instructionId,
			instructionVersion1,
			instructionVersionId1;

		beforeEach(async () => {
			const org = await new Organisation({ name: "Test Org" }).save();
			const organisationId = org._id.toString();

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);

			const user = new User({
				username: "testuser",
				email: "testuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "user",
			});
			await user.save();

			const resLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "testuser@test.com", password: "password" });
			token = resLogin.body.token;

			instruction = new Instruction({
				name: "Test Instruction",
				type: "personality",
				organisation_id: organisationId,
				latestVersion: 2,
			});
			await instruction.save();
			instructionId = instruction._id.toString();

			instructionVersion1 = new InstructionVersion({
				instruction_id: instructionId,
				version: 1,
				content: "This is version 1",
				description: "Description for version 1",
			});
			await instructionVersion1.save();
			instructionVersionId1 = instructionVersion1._id.toString();

			const instructionVersion2 = new InstructionVersion({
				instruction_id: instructionId,
				version: 2,
				content: "This is version 2",
				description: "Description for version 2",
			});
			await instructionVersion2.save();
		});

		it("should return the specific version of the instruction", async () => {
			const res = await request(app)
				.get(
					`/api/instructions/${instructionId}/versions/${instructionVersionId1}`,
				)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("instructionVersionId");
			expect(res.body.version).toBe(1);
			expect(res.body.content).toBe("This is version 1");
		});

		it("should return 404 if instruction is not found", async () => {
			const res = await request(app)
				.get(
					`/api/instructions/60f6e1b9b5f3c1a9c8b4b6d4/versions/${instructionVersionId1}`,
				)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(404);
		});

		it("should return 404 if version is not found", async () => {
			const res = await request(app)
				.get(
					`/api/instructions/${instructionId}/versions/60f6e1b9b5f3c1a9c8b4b6d4`,
				)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(404);
		});

		it("should return 404 if user from another org tries to access", async () => {
			// Create another org and user
			const anotherOrg = await new Organisation({ name: "Another Org" }).save();
			const anotherOrganisationId = anotherOrg._id.toString();
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);
			const anotherUser = new User({
				username: "anotheruser",
				email: "anotheruser@test.com",
				password: hashedPassword,
				organisation_id: anotherOrganisationId,
				role: "user",
			});
			await anotherUser.save();
			const resAnotherLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "anotheruser@test.com", password: "password" });
			const anotherToken = resAnotherLogin.body.token;

			const res = await request(app)
				.get(
					`/api/instructions/${instructionId}/versions/${instructionVersionId1}`,
				)
				.set("Authorization", `Bearer ${anotherToken}`);

			expect(res.statusCode).toEqual(404);
		});
	});

	describe("GET /api/instructions", () => {
		let token, organisationId;

		beforeEach(async () => {
			const org = await new Organisation({ name: "Test Org" }).save();
			organisationId = org._id.toString();

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);

			const user = new User({
				username: "testuser",
				email: "testuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "user",
			});
			await user.save();

			const resLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "testuser@test.com", password: "password" });
			token = resLogin.body.token;

			// We need an admin to create the instructions first
			const adminUser = new User({
				username: "adminuser",
				email: "adminuser@test.com",
				password: hashedPassword,
				organisation_id: organisationId,
				role: "admin",
			});
			await adminUser.save();
			const resAdminLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "adminuser@test.com", password: "password" });
			const adminToken = resAdminLogin.body.token;

			const instruction1 = {
				name: "Test Instruction 1",
				content: "This is a test instruction 1.",
				type: "personality",
				description: "This is a test description 1.",
			};
			const instruction2 = {
				name: "Test Instruction 2",
				content: "This is a test instruction 2.",
				type: "guardian",
				description: "This is a test description 2.",
			};

			await request(app)
				.post("/api/instructions")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(instruction1);
			await request(app)
				.post("/api/instructions")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(instruction2);
		});

		it("should return all instructions for the organisation", async () => {
			const res = await request(app)
				.get("/api/instructions")
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body.length).toBe(2);
			expect(res.body[0].name).toBe("Test Instruction 1");
			expect(res.body[1].name).toBe("Test Instruction 2");
		});

		it("should return an empty array if no instructions", async () => {
			// Create another org and user with no instructions
			const anotherOrg = await new Organisation({
				name: "Another Org",
			}).save();
			const anotherOrganisationId = anotherOrg._id.toString();
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash("password", salt);
			const anotherUser = new User({
				username: "anotheruser",
				email: "anotheruser@test.com",
				password: hashedPassword,
				organisation_id: anotherOrganisationId,
				role: "user",
			});
			await anotherUser.save();
			const resAnotherLogin = await request(app)
				.post("/api/auth/login")
				.send({ email: "anotheruser@test.com", password: "password" });
			const anotherToken = resAnotherLogin.body.token;

			const res = await request(app)
				.get("/api/instructions")
				.set("Authorization", `Bearer ${anotherToken}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body.length).toBe(0);
		});
	});
});
