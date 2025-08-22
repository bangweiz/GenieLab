module.exports = {
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
	setupFilesAfterEnv: ["./tests/setup.js"],
	testTimeout: 30000,
};
