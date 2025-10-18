import { HTTPException } from "hono/http-exception";
import { Context } from "hono";

export function errorHandler(error: Error | HTTPException, c: Context) {
	if (error instanceof HTTPException) {
		return c.json(
			{
				error: "",
				details: error.message,
			},
			error.status,
		);
	}
	return c.json(
		{
			error: "unknown error",
			details: "unknown error detail",
		},
		400,
	);
}
