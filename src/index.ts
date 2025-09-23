import { Hono } from "hono";
import { validateSignupData } from "./utils/validation";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono();

export interface Env {
  DATABASE_URL: string;
}

// Initialize Prisma client inside route handlers where env is available
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/test-db", async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  console.log("prisma", prisma);
  return c.text("helo");
});

app.post("/signup", async (c) => {
  const res = await c.req.json();

  const validation = validateSignupData(res);
  if (!validation.isValid) {
    return c.text(validation.message || "Validation failed", 422);
  }

  return c.text("signup route!");
});

export default app;
