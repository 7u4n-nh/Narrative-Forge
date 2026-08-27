
# Narrative Forge

> A professional narrative development workspace for building and managing complex visual novels.

Narrative Forge is a full-stack workspace designed to keep the moving parts of an interactive narrative in one place: projects, characters, chapters, scenes, story flow, worldbuilding, canon, variables, narrative QA, and project health.

## ✨ Features

- **Project workspace** with project selection and development status.
- **Narrative dashboard** with story progress, project statistics, health metrics, and recent activity.
- **Character database** with roles, descriptions, character arcs, tags, and persistent creation.
- **Chapter management** for organizing the structure of a narrative.
- **Scene management** with locations, types, statuses, and previews.
- **Story flow** for branching decisions and endings.
- **Narrative QA** for reviewing continuity and story health.
- **Worldbuilding and canon** surfaces for maintaining the consistency of the fictional universe.
- **Variables and conditions** for supporting interactive narrative logic.
- **Responsive interface** designed for desktop and smaller screens.
- **Persistent backend** powered by PostgreSQL.
- **Typed API architecture** using OpenAPI, generated clients, and Zod schemas.

The project includes seeded example content for **Echoes of Meridian**, allowing the workspace to be explored immediately after setup.

---

## 🏗️ Architecture

Narrative Forge is organized as a **pnpm workspace**:

```text
Narrative-Forge/
├── artifacts/
│   ├── narrative-forge/       # Main React/Vite application
│   └── api-server/            # Express API
│
├── lib/
│   ├── api-client-react/      # Generated React Query client
│   ├── api-spec/              # OpenAPI source of truth
│   ├── api-zod/               # Generated Zod schemas
│   └── db/                    # Database schema and Drizzle ORM
│
├── scripts/                   # Workspace utilities
├── src/                       # Shared application logic
└── pnpm-workspace.yaml
```
#Technology Stack

##Layer	Technology

Package manager	pnpm workspaces
Runtime	Node.js 24
Language	TypeScript 5.9
Frontend	React + Vite
Styling	Tailwind CSS
UI components	Radix UI
Data fetching	TanStack React Query
Backend	Express 5
Database	PostgreSQL
ORM	Drizzle ORM
Validation	Zod / drizzle-zod
API contract	OpenAPI
API generation	Orval
Build tooling	Vite + esbuild



---

#🚀 Getting Started

Requirements

Before running Narrative Forge locally, make sure you have:

Node.js 24 or newer

pnpm

PostgreSQL

A PostgreSQL connection string available as DATABASE_URL


Installation

Clone the repository:

git clone https://github.com/7u4n-nh/Narrative-Forge.git
cd Narrative-Forge

Install dependencies:

pnpm install

Configure your environment:

DATABASE_URL=your_postgresql_connection_string


---

#▶️ Running the Project

Development API

pnpm --filter @workspace/api-server run dev

The API server runs on port 5000.

Type checking

Run the complete workspace typecheck:

pnpm run typecheck

Build

pnpm run build

API code generation

The OpenAPI specification is the source of truth for the generated API client and schemas.

pnpm --filter @workspace/api-spec run codegen

Database

For development, database schema changes can be pushed with:

pnpm --filter @workspace/db run push

> Note: Database push commands are intended for development environments.




---

##📂 Important Locations

Frontend

artifacts/narrative-forge/src/

Contains the main Narrative Forge workspace, pages, components, and UI logic.

API

artifacts/api-server/src/

Contains the Express API and narrative routes.

Database

lib/db/src/schema/

Contains the PostgreSQL/Drizzle schema.

API specification

lib/api-spec/openapi.yaml

This is the source of truth for the generated API client and validation schemas.

Theme

artifacts/narrative-forge/src/index.css

Contains Narrative Forge's theme tokens and workspace styling utilities.


---

#🔌 API

The current narrative API provides endpoints for:

Projects

Dashboard

Characters

Chapters

Scenes


The frontend communicates with the backend through generated React Query hooks rather than maintaining separate hand-written API clients.

Runtime data is validated using generated Zod schemas.


---

#🧠 Design Philosophy

Narrative Forge is built around a simple idea:

> Interactive stories should be managed as interconnected systems, not isolated documents.



The project follows several principles:

1. One narrative source of truth

Characters, scenes, chapters, branches, variables, chronology, and world rules should remain connected.

2. Contract-first development

The OpenAPI specification defines the API contract, while generated clients and schemas keep frontend and backend synchronized.

3. Persistent editing

Important changes made inside the workspace should survive reloads and sessions.

4. Narrative integrity

The system is designed to help detect and manage continuity problems across complex stories.

5. Progressive expansion

Narrative Forge is designed to grow from its current vertical slice into a complete narrative production environment.


---

#📖 Example Project

The repository includes a seeded example project:

Echoes of Meridian

Genre: Mystery · Supernatural

> A branching mystery about memory, grief, and the city that refuses to forget.



The example project contains:

Characters

Chapters

Scenes

Story branches

Narrative health information

Recent activity

Continuity-related data


This allows the workspace to be explored without having to create an entire project from scratch.


---

#🧪 Project Status

Narrative Forge currently represents a functional vertical slice of the larger narrative-development platform.

The repository already contains:

A functional workspace UI

Persistent PostgreSQL-backed data

Express API routes

Generated API clients

OpenAPI definitions

Zod validation

Narrative database schemas

Seeded example content

Character creation

Project management

Chapter and scene data

Narrative dashboard and health metrics


Additional narrative systems and deeper production workflows can continue to be expanded on top of this foundation.


---

##🛠️ Development

A typical development workflow is:

# Install dependencies
pnpm install

# Check types
pnpm run typecheck

# Build the workspace
pnpm run build

# Start the API
pnpm --filter @workspace/api-server run dev

When modifying the API contract, regenerate the clients afterward:

pnpm --filter @workspace/api-spec run codegen


---

#📜 License

Narrative Forge is licensed under the Apache License 2.0.

See LICENSE for the complete license text.

Third-party dependencies, libraries, generated components, and other external assets remain subject to their respective licenses and notices.


---

##👤 Author

Juan Gabriel Cardozo Benítez

Creator and maintainer of Narrative Forge.


---

#🌌 Vision

Narrative Forge aims to become more than a writing tool.

It is intended to be a development environment for interactive narratives — somewhere a writer can design characters, construct worlds, map branching stories, track continuity, manage variables, and eventually bring an entire visual novel from concept to production.

Build the story. Map the possibilities. Forge the narrative.
