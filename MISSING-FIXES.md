# Missing Fixes — Symios

Issues identified during codebase audit that could not be corrected automatically.
Each entry explains why it's blocked and what's needed to resolve it.

---

## 1. Missing Better Auth API handler route

**File needed:** `src/routes/api/auth/[...all]/+server.ts`

**Why blocked:** This catch-all route is required by `better-auth/svelte-kit` to handle
login, register, logout, session refresh, and all auth API calls. Without it, auth
is non-functional on a fresh deploy.

**What to do:** Create the file with the standard SvelteKit handler from
<https://www.better-auth.com/docs/integrations/sveltekit>:

```ts
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const { GET, POST } = svelteKitHandler(auth);
```

(The exact pattern depends on your better-auth version — check the docs for the
current release.)

---

## 2. Missing auth schema SQL

**File needed:** `src/lib/server/schema.sql` (generated, not written by hand)

**Why blocked:** The `auth:generate` script has never been run. On a fresh database
deploy there are no better-auth internal tables (`user`, `session`, `account`,
`verification`), so auth will fail immediately.

**What to do:** Either:

- Run `bun run auth:generate` on a machine with the env vars set (it reads
  `src/lib/server/auth.ts` and outputs SQL), then commit the generated SQL file.
- Or place the schema inline in your DB init script — better-auth's generated SQL
  gives you the exact CREATE TABLE statements.

---

## 3. Dockerfile package-manager mismatch

**File:** `Dockerfile`

**Why blocked:** The Dockerfile uses `npm ci` / `npm run build`, but the project
has `bun.lock` and no `package-lock.json`. `npm ci` will exit with an error
because no lockfile exists.

**What to do:** Pick one approach:

- **Switch Dockerfile to Bun:**
  ```dockerfile
  FROM oven/bun:1 AS builder
  WORKDIR /app
  COPY package.json bun.lock ./
  RUN bun install --frozen-lockfile
  COPY . .
  RUN bun run build
  ```
- **Or switch to npm:** Run `npm install` once to generate `package-lock.json`,
  commit it, and keep the existing Dockerfile as-is.

---

## 4. Stripe API version mismatch

**File:** `src/lib/server/stripe.ts` (line 8)

**Error:** `Type '"2025-02-24.acacia"' is not assignable to type '"2026-08-26.dahlia"'`

**Why blocked:** The Stripe SDK installed by `bun.lock` expects the 2026-08-26
API version (`dahlia`), but `stripe.ts` hardcodes `2025-02-24.acacia`. The type
error breaks `svelte-check`.

**What to do:** Update the `apiVersion` string if your Stripe account supports
the newer version, or pin the Stripe SDK to a version that accepts the older one.

```ts
export const stripe = building
  ? (null as unknown as Stripe)
  : new Stripe(STRIPE_PRIVATE_KEY, { apiVersion: '2026-08-26.dahlia' });
```

---

## 5. `STRIPE_WEBHOOK_SECRET` not in typed env declarations

**File:** `src/routes/api/stripe/webhook/+server.ts` (dynamic import)

**Error:** `Property 'STRIPE_WEBHOOK_SECRET' does not exist on type 'typeof import("$env/static/private")'`

**Why blocked:** The webhook handler dynamically imports `$env/static/private`
and destructures `STRIPE_WEBHOOK_SECRET`, but this env var may not be in your
`.env` file, and SvelteKit's type generation doesn't see it.

**What to do:** Ensure `STRIPE_WEBHOOK_SECRET` is in your `.env` file:
```
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```
Then restart the dev server so SvelteKit regenerates its env type declarations.

---

## 6. Homepage stats are hardcoded

**File:** `src/routes/+page.svelte` (lines 35–41)

**Details:** The stats section shows hardcoded numbers (15+ projets, 10 missions,
100% uptime, 24/7 support) rather than reading from any database or API.

**Why blocked:** There's no queries in `+page.server.ts` to fetch real metrics,
and the infrastructure to track project counts / uptime isn't wired in. Adding
fake-real-time stats requires either DB counters or an uptime monitoring service.

**What to do (options):**
- Replace with a static "coming soon" / "à venir" placeholder
- Add actual counters to your DB and load them in `+page.server.ts`
- Remove the section entirely if you don't have the data

---

## 7. Image assets need optimization

**Files:** `static/images/favicon.png` (149 KB), `static/images/icon.png` (495 bytes)

**Why blocked:** The favicon is far too large (149 KB for a 180×180 favicon is
~10× the norm) and will slow down loads. The OG image (`icon.png`) is only 495
bytes — likely a tiny placeholder that will render poorly as an Open Graph image.

**What to do:**
- **favicon.png** — Resize to 180×180 and optimize (target 5–15 KB, PNG or WebP).
  Tools: `imagemagick`, `pngquant`, `squoosh`.
- **icon.png** — Replace with a proper 1200×630 OG image at ~50–200 KB.
  Your site already references it for Open Graph and Twitter cards.

---

## Pre-existing build errors (not introduced by fixes)

These 2 errors existed before any fixes were applied. `bun run check` still
reports them:

| Error | File | Status |
|-------|------|--------|
| Stripe API version mismatch | `src/lib/server/stripe.ts:8` | See #4 above |
| `STRIPE_WEBHOOK_SECRET` type | `src/routes/api/stripe/webhook/+server.ts` | See #5 above |

Two cosmetic warnings (`state_referenced_locally` on the checkout page) are
also pre-existing and won't affect runtime.