import mongoose from "mongoose";

const uri = `mongodb+srv://${Bun.env.DB_USER}:${Bun.env.DB_PASS}@cluster0.xgsbcjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connectDB() {
	try {
		await mongoose.connect(uri);
		console.log("MongoDB Connected Successfully");
	} catch (error) {
		console.error("MongoDB Connection Error: ", error);
		process.exit(1);
	}
}

export default connectDB;
