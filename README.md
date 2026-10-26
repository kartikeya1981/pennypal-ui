# PennyPal

A mobile-first web app that helps parents teach kids under 18 how to manage money with virtual **Kid Coins**. Parents run the accounts (kids don't need their own phone). Each kid gets a monthly **Earning**, can save towards goals, earn extra coins by doing tasks, and cash out real money when a parent records a payout. Every coin in and out shows on the kid's statement.

## Status

Milestone 1 (this scaffold): parent sign-up / sign-in, kid profiles (name, avatar, birth year, monthly earning and earning day), a phone-friendly layout with a bottom tab bar, and an installable web app manifest.

Coming next: the Kid Coins ledger and goals, monthly auto-allocation, tasks, payouts, statements and Kid Mode.

## Architecture

This repo is the web UI (Next.js). All data and authentication live in the separate [pennypal-api](https://github.com/kartikeya1981/pennypal-api) service. Server components and server actions call the API with the parent's token, which is kept in the httpOnly `pp_token` cookie, so the token is never exposed to browser JavaScript.

## Tech stack

Next.js 15 (App Router, Server Actions) · React 19 · TypeScript · Tailwind CSS v4 + shadcn/ui (Base UI)

## Getting started

Requires Node.js 20+ and a running [pennypal-api](https://github.com/kartikeya1981/pennypal-api) (default `http://localhost:4000`).

```bash
npm install
cp .env.example .env          # set API_URL if the API is not on http://localhost:4000
npm run dev                   # http://localhost:3000
```

Demo login (after seeding the API): `demo@pennypal.app` / `demo1234`.

Scripts: `npm run build` + `npm start` (production), `npm run lint`, `npm run typecheck`.

## Mobile and install

Layouts are built for phones first: on small screens navigation moves to a bottom tab bar and safe-area insets are respected. `src/app/manifest.ts` plus the icons in `public/icons/` make the app installable ("Add to Home screen") and open it standalone at `/dashboard`.

## Project layout

```
src/app/(auth)/        login & register
src/app/(app)/         signed-in pages (family dashboard, kid profile, settings)
src/app/manifest.ts    web app manifest
src/components/        app shell, kid form, Kid Coins display, shadcn/ui components
src/lib/api.ts         API client (token cookie, date parsing, 401 handling)
src/lib/actions/       server actions that call the API
src/lib/format.ts      Kid Coins, age and schedule formatting
```

## Tests

| Layer | Tooling | Location | Command |
| --- | --- | --- | --- |
| Unit | Vitest | `tests/unit/` | `npm test` |
| End-to-end | Playwright | `e2e/` | `npm run test:e2e` |

End-to-end tests drive the real UI against a real pennypal-api, which must be cloned next to this repo (`../pennypal-api`, or set `E2E_API_DIR`) with a `.env` and `npm run setup` done. Playwright starts both servers. Each test registers its own parent through the API, so tests are isolated and run in parallel. Specs tagged `@mobile` also run on Pixel 7 and iPhone 14 viewports.

| Spec | Covers |
| --- | --- |
| `auth.spec.ts` | Landing page, register, duplicate email, login/logout, protected-route redirects, bad session cookie |
| `kids.spec.ts` | Add, list, edit and delete kid profiles; API validation in the form; other families' kids are hidden |
| `navigation.spec.ts` | Navigation on desktop and phones, settings, bottom tab bar vs sidebar, no horizontal overflow on phones |
| `pwa.spec.ts` | Web manifest, icons, theme colour and Apple touch icon |

Set `E2E_START_SERVERS=false` to run against servers you started yourself.

### CI

`.github/workflows/test.yml` runs lint, typecheck and unit tests on every push and PR. The Playwright job checks out pennypal-api, which is private, so it needs an `API_REPO_TOKEN` repository secret: a fine-grained PAT with **Contents: read** on `kartikeya1981/pennypal-api`. Without the secret, the E2E job is skipped with a warning.
