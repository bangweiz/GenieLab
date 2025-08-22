const app = require("./src/app");
const connectDB = require("./src/config/database");

const port = process.env.PORT || 3000;

async function start() {
	await connectDB();

	app.listen(port, async () => {
		console.log(`Server is listening on port ${port}`);
	});
}

start();
