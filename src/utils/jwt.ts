import jwt from "jsonwebtoken";
import { prismaClient } from "../db";

export interface TokenPayload {
  id: number;
  email: string;
  exp?: number;
}

export const generateToken = (
  payload: { id: number; email: string },
  secretKey: string
): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: 60 * 60 * 24, // 24 hours
  });
};

export const verifyToken = async (
  token: string,
  secretKey: string,
  type: string
): Promise<{ success: boolean; payload?: TokenPayload; error?: string }> => {
  try {
    const decoded = jwt.decode(token) as any;
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);

    if (decoded!.exp && now > decoded!.exp && type != "session") {
      return { success: false, error: "Token expired" };
    }
    // Verify user still exists

    const userExists = await prismaClient.user.findFirst({
      where: {
        email: decoded.email,
        id: decoded.id,
      },
    });

    if (!userExists) {
      return { success: false, error: "User doesn't exist" };
    }

    return { success: true, payload: decoded };
  } catch (error) {
    return { success: false, error: "Invalid token" };
  }
};
