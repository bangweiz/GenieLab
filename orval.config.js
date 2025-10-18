module.exports = {
	genieLab: {
		output: {
			client: "zod",
			mode: "split",
			definitions: true,
			biome: true,
			target: "./src/types/gen/endpoints",
			schemas: "./src/types/gen/schemas",
		},
		input: {
			target: "./swagger/openapi.yaml",
		},
	},
};
