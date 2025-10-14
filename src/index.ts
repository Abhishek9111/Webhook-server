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
    where: { email: res.username },
  });
  if (userExists) {
    return res.status(403).json({
      message: "User already exists",
    });
  }
  const passwordHash = bcrypt.hashSync(res.password, c.env.saltRounds);
  console.log(res.email, res.username, passwordHash);
  const user = await prismaClient.user.create({
    email: res.email,
    userName: res.username,
    passwordHash,
  });

  return res.json({ message: "Success!" });
});

app.post("/signin", async (c: any) => {
  const res = await c.req.json();
  const passwordHash = bcrypt.hashSync(res.password, c.env.saltRounds);
  const user = await prismaClient.user.findFirst({
    where: {
      email: res.email,
      password: passwordHash,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "User doesn't exist",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    c.env.SECRET_KEY
  );

  res.json({
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
