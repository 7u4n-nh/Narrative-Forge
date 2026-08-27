# Narrative Forge

Narrative Forge is a professional narrative development workspace for building complex visual novels.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/narrative-forge/src/` — responsive workspace shell and narrative tool pages
- `artifacts/api-server/src/routes/narrative.ts` — dashboard, character, chapter, and scene API
- `lib/db/src/schema/narrative.ts` — PostgreSQL source-of-truth for narrative records
- `lib/api-spec/openapi.yaml` — source-of-truth for generated API hooks and schemas
- `artifacts/narrative-forge/src/index.css` — Narrative Forge theme tokens and workspace utilities

## Architecture decisions

- The first vertical slice uses the shared API server and PostgreSQL so dashboard reads and character creation persist across reloads.
- The UI uses generated React Query hooks from the OpenAPI contract rather than hand-written fetch clients.
- Seeded story data makes the workspace immediately explorable while the rest of the narrative model expands.

## Product

- Explore project health, progress, stats, and recent activity from the workspace dashboard.
- Search and filter a character database, inspect dossiers, and add new characters.
- Review chapters, scenes, chronology, and story flow.
- Navigate to worldbuilding, canon, variables, QA, and project settings surfaces.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
