# Symios

SvelteKit (TypeScript) app with [Better Auth](https://www.better-auth.com/) on MySQL.

## Stack

- **SvelteKit** + **TypeScript** — app framework
- **Vite** — dev server / bundler
- **Node** runtime, **npm** package manager
- **Better Auth** — authentication (email + password enabled)
- **MySQL** — database, via the `mysql2` driver

## Setup

1. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — MySQL connection string (e.g. `mysql://user:pass@localhost:3306/symios`)
   - `BETTER_AUTH_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
   - `BETTER_AUTH_URL` — app base URL (`http://localhost:5173` in dev)

2. Create the database, then generate the auth tables:

   ```bash
   npm run auth:migrate     # applies Better Auth's schema to MySQL
   # or: npm run auth:generate  # writes the SQL to src/lib/server/schema.sql instead
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Auth layout

- `src/lib/server/db.ts` — shared `mysql2` connection pool
- `src/lib/server/auth.ts` — server-side Better Auth instance
- `src/lib/auth-client.ts` — client-side auth (`signIn`, `signUp`, `signOut`, `useSession`)
- `src/hooks.server.ts` — populates `event.locals.{session,user}` and mounts the auth handler
- `src/routes/api/auth/[...all]/+server.ts` — Better Auth API endpoints

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run preview` — production build / preview
- `npm run check` — type-check the project
- `npm run auth:migrate` / `npm run auth:generate` — manage the auth DB schema
