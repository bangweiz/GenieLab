import { Hono } from "hono";
import organisationRoute from "./routes/organisation.route";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";

connectDB();

const app = new Hono();

app.route("/v1", organisationRoute);

app.onError(errorHandler);

export default app;
