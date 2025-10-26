import { Hono } from "hono";
import { authMiddleware } from "./middleware";
import userRouter from "./router/userRouter";
const app = new Hono();

export interface Env {
  DATABASE_URL: string;
  saltRounds: number;
  SECRET_KEY: string;
}

// Initialize Prisma client inside route handlers where env is available
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/user", userRouter);

export default app;
