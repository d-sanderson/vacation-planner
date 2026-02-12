# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

SvelteKit 5 (Svelte 5 runes syntax) deployed on **Cloudflare Workers** with D1 (SQLite). Uses Drizzle ORM, better-auth for authentication, Tailwind CSS 4, Mapbox GL JS for maps, and Open-Meteo for weather data.

## Commands

```bash
pnpm dev              # Local dev server
pnpm build            # Production build
pnpm run preview      # Build + wrangler dev (Cloudflare local preview)
pnpm run check        # Svelte type checking
pnpm run db:generate  # Generate Drizzle migrations
pnpm run db:migrate   # Run migrations locally
pnpm run db:push      # Push schema directly to DB
pnpm run db:studio    # Open Drizzle Studio
pnpm run deploy       # Build + deploy to Cloudflare Workers
```

## Architecture

### Database (`src/lib/server/db/`)
- **schema.ts** — Drizzle schema: `trip`, `day`, `activity`, `trip_member`, `comment` (plus auth tables from `better-auth-schema.ts`)
- **index.ts** — DB client factory: uses Cloudflare D1 in production (`event.platform?.env.DB`), libsql for local dev
- **migrations/** — SQL migration files managed by drizzle-kit
- Timestamps use `integer` with `mode: 'timestamp_ms'`. IDs are `crypto.randomUUID()`. Sort ordering via `sortOrder` fields.

### Auth (`src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/hooks.server.ts`)
- better-auth handles auth routes automatically via `svelteKitHandler` in hooks
- `hooks.server.ts` initializes DB, auth, and populates `event.locals.user`/`event.locals.session`
- Two roles: `admin` (full CRUD) and `viewer` (read-only + comments)

### Authorization Middleware (`src/lib/server/middleware.ts`)
- `requireAuth()`, `requireAdmin()`, `requireTripMember()` — used in API routes to guard mutations

### API Routes (`src/routes/api/`)
- RESTful: `/api/trips`, `/api/days`, `/api/activities`, `/api/trips/[id]/members`, `/api/trips/[id]/comments`
- Special: `POST /api/activities/reorder` for drag-and-drop reordering
- All mutations are admin-only except comments (any authenticated user)

### Pages (`src/routes/`)
- `/` — Trip list (admin sees all, viewers see public + their trips)
- `/trips/[id]` — Trip detail with nested days/activities, members, comments, weather
- `/login`, `/register` — Auth pages

### Components (`src/lib/components/`)
- Use Svelte 5 runes (`$props`, `$state`, `$derived`) and snippet rendering (`{@render children()}`)

### Styling
- Tailwind 4 with custom `@theme` palette: sand, coral, ocean, volcanic, navy
- Fonts: Playfair Display (headings), DM Sans (body)
- Custom animations: fadeSlideUp, fadeIn, scaleIn

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — local SQLite path (e.g. `file:local.db`)
- `BETTER_AUTH_SECRET` — random secret for auth
- `BETTER_AUTH_URL` — base URL (e.g. `http://localhost:5173`)
- `PUBLIC_MAPBOX_TOKEN` — Mapbox API token for maps/geocoding

Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth)

## Deployment

Cloudflare Workers with D1 database. Use `wrangler secret put [var-name]` to set env vars on Cloudflare. Remote migrations: `wrangler d1 migrations apply vacation-planner-db --remote`.
