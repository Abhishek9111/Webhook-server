import { Hono } from "hono";
import userRouter from "./router/userRouter";
import { prismaClient } from "./db";
import webHookRouter from "./router/webHookRouter";
import { cors } from "hono/cors";
const app = new Hono();

export interface Env {
  DATABASE_URL: string;
  saltRounds: number;
  SECRET_KEY: string;
}

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Initialize Prisma client inside route handlers where env is available
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/debug", (c) => {
  return c.json({
    url: c.env.UPSTASH_REDIS_REST_URL || "missing",
    tokenExists: !!c.env.UPSTASH_REDIS_REST_TOKEN,
  });
});
app.route("/user", userRouter);

app.route("/webhook", webHookRouter);

process.on("SIGINT", async () => {
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prismaClient.$disconnect();
  process.exit(0);
});
export default app;
