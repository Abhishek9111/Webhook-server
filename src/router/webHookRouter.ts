import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { prismaClient } from "../db";
import { verifyToken } from "../utils/jwt";

const webHookRouter = new Hono();

export default webHookRouter;
