import { Hono } from "hono";
import organisationRoute from "./routes/organisation.route";
import authRoute from "./routes/auth.route";
import instructionRoute from "./routes/instruction.route";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";

connectDB();

const app = new Hono();

app.route("/v1", organisationRoute);
app.route("/v1", authRoute);
app.route("/v1", instructionRoute);

app.onError(errorHandler);

export default app;
