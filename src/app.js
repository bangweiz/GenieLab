const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the application." });
});

app.use("/api", router);

// Error handling middleware
app.use(errorHandler);

// listen for requests
const port = process.env.PORT || 3000;

async function start() {
	await connectDB();

	app.listen(port, async () => {
		console.log(`Server is listening on port ${port}`);
	});
}

module.exports = start;
