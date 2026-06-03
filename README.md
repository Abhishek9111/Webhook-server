## Features

- User signup and sign-in with JWT cookies
- Create unique webhook endpoints per user (`POST /webhook/add`)
- Receive inbound webhook data on public URLs (`POST /webhook/data/:id`)
- List stored payloads and registered webhooks for authenticated users
- Prisma Accelerate for edge-friendly database access
- Upstash Redis for fast webhook slug → database id lookup

## Tech stack

- **Runtime**: Cloudflare Workers ([Wrangler](https://developers.cloudflare.com/workers/wrangler/))
- **Framework**: Hono
- **Database**: PostgreSQL + [Prisma](https://www.prisma.io/) (Accelerate at runtime, direct URL for migrations)
- **Cache**: [Upstash Redis](https://upstash.com/) (REST)

## Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. Neon, Supabase, or local Docker)
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) API key (for `DATABASE_URL`)
- An [Upstash](https://console.upstash.com/) Redis database (REST URL + token)
- Cloudflare account (for deploy)

## Environment variables

| Variable                   | Required         | Used by      | Description                                                    |
| -------------------------- | ---------------- | ------------ | -------------------------------------------------------------- |
| `DATABASE_URL`             | Yes              | App / Worker | Prisma Accelerate connection string (`prisma://accelerate...`) |
| `DIRECT_DATABASE_URL`      | Yes (migrations) | Prisma CLI   | Direct `postgresql://` URL for `prisma migrate` only           |
| `SECRET_KEY`               | Yes              | App / Worker | Secret for signing and verifying JWT auth tokens               |
| `saltRounds`               | Yes              | App / Worker | bcrypt cost factor (number, e.g. `10`)                         |
| `UPSTASH_REDIS_REST_URL`   | Yes              | App / Worker | Upstash Redis REST endpoint                                    |
| `UPSTASH_REDIS_REST_TOKEN` | Yes              | App / Worker | Upstash Redis REST token                                       |

See [`.env.example`](./.env.example) for a template with placeholder values.

### Local setup

1. Copy the example file and fill in real values:

   ```bash
   cp .env.example .env
   cp .env.example .dev.vars
   ```

2. **`.env`** — used by Prisma (`prisma migrate`, `prisma generate`) via `prisma.config.ts` and `dotenv`.

3. **`.dev.vars`** — used by `wrangler dev` for Worker bindings (same keys as above). Format: `KEY=value` per line, no quotes required unless the value contains spaces.

4. Do not commit `.env`, `.dev.vars`, or `wrangler.jsonc` (they are gitignored).

### Production (Cloudflare)

Set each variable as a Worker secret or var, for example:

```bash
wrangler secret put SECRET_KEY
wrangler secret put DATABASE_URL
wrangler secret put DIRECT_DATABASE_URL
wrangler secret put UPSTASH_REDIS_REST_URL
wrangler secret put UPSTASH_REDIS_REST_TOKEN
# saltRounds is often a plain var (number) in wrangler.jsonc / dashboard
```

## Getting started

```bash
npm install
```

Apply database schema:

```bash
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

Run locally:

```bash
npm run dev
```

Deploy to Cloudflare:

```bash
npm run deploy
```

Generate Worker binding types after configuring Wrangler:

```bash
npm run cf-typegen
```

## API overview

Base path depends on your Worker route prefix; routes below are relative to the app root.

| Method | Path                    | Auth   | Description                                           |
| ------ | ----------------------- | ------ | ----------------------------------------------------- |
| `GET`  | `/`                     | No     | Health / hello                                        |
| `GET`  | `/debug`                | No     | Redis env check (dev only; remove in production)      |
| `POST` | `/user/signup`          | No     | Create account; sets `authToken` cookie               |
| `POST` | `/user/signin`          | No     | Sign in; sets `authToken` cookie                      |
| `GET`  | `/user/session-refresh` | Bearer | Refresh JWT using `Authorization` header              |
| `POST` | `/webhook/add`          | Cookie | Create a new webhook URL slug                         |
| `GET`  | `/webhook/data/:id`     | Cookie | List payloads received for webhook `:id`              |
| `GET`  | `/webhook/get-all`      | Cookie | List webhook URLs for the current user                |
| `POST` | `/webhook/data/:id`     | No     | **Inbound webhook** — external systems POST JSON here |

CORS is configured for `http://localhost:3000` in `src/index.ts`; adjust `origin` for your frontend URL in production.

### Auth notes

- Protected routes expect an `authToken` HTTP-only cookie (set on signup/signin).
- `session-refresh` expects `Authorization: <token>`.

## Project structure

```
src/
  index.ts           # Hono app, CORS, route mounting
  router/
    userRouter.ts    # Signup, signin, session refresh
    webHookRouter.ts # Webhook CRUD and inbound receiver
  middleware.ts      # JWT cookie auth
  db/index.ts        # Prisma Client (Accelerate)
  redis.ts           # Upstash Redis client
prisma/
  schema.prisma      # User, Webhookhash, Webhookdata models
```
