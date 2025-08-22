const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

module.exports = app;
