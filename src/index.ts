import { Hono } from "hono";
import { validateSignupData } from "./utils/validation";
import bcrypt from "bcryptjs";
import { prismaClient } from "./db";
import jwt from "jsonwebtoken";

const app = new Hono();

export interface Env {
  DATABASE_URL: string;
  saltRounds: number;
}

// Initialize Prisma client inside route handlers where env is available
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/signup", async (c: any) => {
  const res = await c.req.json();

  const validation = validateSignupData(res);

  if (!validation.isValid) {
    return c.text(validation.message || "Validation failed", 422);
  }
  const userExists = await prismaClient.user.findFirst({
    where: { email: res.email },
  });
  if (userExists) {
    return c.json({
      status: 403,
      message: "User already exists",
    });
  }
  const passwordHash = bcrypt.hashSync(res.password, c.env.saltRounds);

  const user = await prismaClient.user.create({
    data: {
      email: JSON.stringify(res.email),
      userName: res.userName,
      passwordHash,
    },
  });
  return c.json({ message: "Success!" });
});

app.post("/signin", async (c: any) => {
  const res = await c.req.json();
  const passwordHash = bcrypt.hashSync(res.password, c.env.saltRounds);
  const user = await prismaClient.user.findFirst({
    where: {
      email: JSON.stringify(res.email),
      passwordHash,
    },
  });

  if (!user) {
    return c.json({
      status: 403,
      message: "User doesn't exist",
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    c.env.SECRET_KEY
  );

  c.json({
    user,
    token,
  });
});

// app.get("/user", async (c) => {
//   const id = c.id;

//   const user = await prismaClient.user.findFirst({
//     where: {
//       id,
//     },
//     select: {
//       name: true,
//       email: true,
//       webHookHashes: true,
//     },
//   });
// });

export default app;
