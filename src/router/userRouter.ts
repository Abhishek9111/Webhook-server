import { Hono } from "hono";
import { validateSignupData, validateSignInData } from "../utils/validation";
import bcrypt from "bcryptjs";
import { prismaClient } from "../db";
import { verifyToken, generateToken } from "../utils/jwt";

const userRouter = new Hono();

export interface Env {
  DATABASE_URL: string;
  saltRounds: number;
  SECRET_KEY: string;
}

userRouter.post("/signup", async (c: any) => {
  const res = await c.req.json();

  const validation = validateSignupData(res);

  if (!validation.isValid) {
    return c.text(validation.message || "Validation failed", 422);
  }
  const userExists = await prismaClient.user.findFirst({
    where: { email: res.email },
  });
  if (userExists) {
    return c.json(
      {
        message: "User already exists",
      },
      403
    );
  }
  const passwordHash = bcrypt.hashSync(res.password, c.env.saltRounds);
  console.log("this is res");
  const user = await prismaClient.user.create({
    data: {
      email: JSON.stringify(res.email),
      userName: res.userName,
      passwordHash,
    },
  });
  return c.json({ message: "Success!" });
});

userRouter.post("/signin", async (c: any) => {
  const res = await c.req.json();

  const validation = validateSignInData(res);

  if (!validation.isValid) {
    return c.text(validation.message || "Validation failed", 422);
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: JSON.stringify(res.email),
    },
  });

  if (!user) {
    return c.json({
      status: 403,
      message: "User doesn't exist",
    });
  }

  const result = await bcrypt.compare(res.password, user.passwordHash);

  if (!result) {
    return c.json({
      message: "Incorrect password",
    });
  }

  const token = generateToken(
    { email: user.email, id: user.id },
    c.env.SECRET_KEY
  );

  return c.json({
    user_detail_id: user.id,
    userName: user.userName,
    token,
  });
});

userRouter.get("/session-refresh", async (c: any) => {
  const header = await c.req.header("Authorization");
  const result = await verifyToken(header, c.env.SECRET_KEY, "session");
  if (result.error === "User doesn't exist") {
    return c.json({ status: 403, message: "User doesn't exist" }, 403);
  } else {
    const token = generateToken(
      { email: result.payload!.email, id: result.payload!.id },
      c.env.SECRET_KEY
    );
    return c.json({
      token,
    });
  }
});

export default userRouter;
