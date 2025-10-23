import { Context, Next } from "hono";
import mongoose from "mongoose";

async function transactionMiddleware(c: Context, next: Next) {
	const session = await mongoose.startSession();
	session.startTransaction();
	c.set("session", session);
	try {
		await next();
		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

export type SessionVariable = {
	session: mongoose.mongo.ClientSession | null;
};

export default transactionMiddleware;
