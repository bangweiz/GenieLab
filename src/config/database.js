const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zzehls0.mongodb.net/GenieLab?retryWrites=true&w=majority&appName=Cluster0`;

async function connectDB() {
	try {
		await mongoose.connect(MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
}

module.exports = connectDB;
