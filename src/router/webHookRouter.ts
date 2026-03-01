import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db";
import { sign, decode } from "hono/jwt";
import { redis } from "../redis";
const webHookRouter = new Hono();

// add auto-expire in 5 days to scale up, make uuid unique in the db
webHookRouter.post("/add", authMiddleware, async (c: any) => {
  const uuid = uuidv4();

  const userId = c.get("userId");

  let data = await prismaClient.webhookhash.create({
    data: {
      urlString: uuid,
      user_detail_id: userId,
    },
  });
  console.log("this is data", data);
  try {
    await redis.set(data.urlString, String(data.id));
  } catch (e) {
    console.error("Redis set failed:", e);
    return c.json(
      { error: "Failed to store webhook", details: String(e) },
      500,
    );
  }
  return c.json({ data: data.urlString });
});

webHookRouter.get(`/data/:id`, authMiddleware, async (c: any) => {
  const id = c.req.param("id");
  const indexId = await redis.get(id);
  if (!indexId) {
    return c.json({ message: "Invalid URL" }, 400);
  }
  const data = await prismaClient.webhookdata.findMany({
    where: {
      webHookId: indexId,
    },
  });
  console.log("this is data", data);
  return c.json({ data }, 200);
});

webHookRouter.post(`/data/:id`, authMiddleware, async (c: any) => {
  const id = c.req.param("id");
  const res = await c.req.json();
  const indexId = await redis.get(id);
  if (!indexId) {
    return c.json({ message: "Invalid URL" }, 400);
  }

  const data = await prismaClient.webhookdata.create({
    data: {
      apiCallUrl: c.req.url,
      webHookId: Number(indexId),
      typeOfCall: "POST",
      data: res,
    },
  });

  return c.json({}, 200);
});

export default webHookRouter;
