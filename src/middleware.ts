import { verifyToken } from "./utils/jwt";

export const authMiddleware = async (c: any, next: any) => {
  const header = c.req.header("cookie").split("=")[1];
  if (!header) {
    return c.json({ message: "No token provided" }, 401);
  }

  const result = await verifyToken(header, c.env.SECRET_KEY, "middleware");

  if (!result.success) {
    if (result.error === "Token expired") {
      return c.json({ status: 401, message: "Token expired" }, 401);
    }
    if (result.error === "User doesn't exist") {
      return c.json({ status: 403, message: "User doesn't exist" }, 403);
    }
    return c.json({ message: "Invalid token" }, 401);
  }

  // Add user info to context
  c.set("userId", result.payload!.id);
  c.set("userEmail", result.payload!.email);

  await next();
};
