---
name: Narrative API contract generation
description: A compatibility constraint for integer-like fields in this workspace's OpenAPI/Zod generation.
---

The current OpenAPI-to-Zod toolchain emits `zod.int()` for OpenAPI `integer`, but the installed Zod runtime exposes the older API. Use numeric fields for integer-like dashboard and ordering values until the generator/runtime versions are aligned.

**Why:** Code generation can succeed while the chained library typecheck fails, blocking both the API server and frontend from seeing fresh generated types.

**How to apply:** When adding numeric fields to `lib/api-spec/openapi.yaml`, prefer `type: number` for this project unless the Zod generator/runtime has been upgraded together and verified.