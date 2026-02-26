import { PrismaClient } from "@prisma/client/edge";

export const prismaClient = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
});
