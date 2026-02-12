
# Getting Started

- Provision Database
`wrangler d1 create [db-name]`

- Generate Local Database
`pnpm run db:generate`

- Run Local Migrations
`pnpm run db:migrate`

- Gather Environment Variables
https://www.better-auth.com/docs/installation
create google auth app using google cloud and save client id and client secret to .env file

- Save Environment Variables to Cloudflare
`wrangler secret put [var-name]` and provide value from .env file

- Run Cloudflare Migrations
`wrangler d1 migrations apply [db-name] --remote`

- Deploy to Cloudflare
`wrangler deploy`

OR

- Develop locally
`pnpm run dev`

# Schema Changes

After modifying `src/lib/server/db/schema.ts`:

1. Generate a migration
`pnpm run db:generate`

2. Apply locally
`pnpm run db:migrate`

3. Apply to Cloudflare D1
`wrangler d1 migrations apply vacation-planner-db --remote`
