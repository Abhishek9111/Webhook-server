import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // Use the direct Postgres connection for migrations
    url: env("DIRECT_DATABASE_URL"),
  },
});
