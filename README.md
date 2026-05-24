<div align="center">

<img src="public/logo.svg" alt="Famlyzer AI" width="80" height="80" />

# Famlyzer AI

**Autonomous AI Decision & Planning Intelligence**

*Life &middot; Family &middot; Team &middot; Finance SaaS Platform*

[![Version](https://img.shields.io/badge/version-4.0.0-emerald?style=flat-square&logo=semantic-release)](https://github.com/mulkymalikuldhrs/famlyzer-ai)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-22-635bff?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](LICENSE)

</div>

---

Famlyzer AI is a production SaaS platform that manages **time, money, energy, relationships, and life goals** in one unified system — with AI as the operator, not just an assistant. Seven specialized AI agents operate across four autonomous levels, powered by a four-layer memory system, a Knowledge Vault as the single source of truth, and financial intelligence with sacred-budget auto-veto — all within workspace-scoped multi-tenant isolation.

> **We sell access to intelligence, memory, and AI's ability to think & act.**

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Overview](#api-overview)
- [AI Agents](#ai-agents)
- [Subscription Pricing](#subscription-pricing)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [License](#license)

---

## Features

### 7 Autonomous AI Agents

Specialized agents that think, reason, and act within boundaries you define — each with domain expertise and cross-agent coordination orchestrated by the Executive Agent.

| Agent | Role |
|-------|------|
| **Planner** | Schedule optimization, task assignment, deadline conflict detection |
| **Finance** | Budget monitoring, overspend auto-veto, anomaly detection, goal tracking |
| **Mediator** | Conflict detection, interpersonal dynamics, priority alignment |
| **Health** | Energy/stress monitoring, burnout prevention, wellness trend analysis |
| **Education** | Skill gap analysis, learning recommendations, education budget tracking |
| **Memory** | Consistency checking, pattern recognition, context retrieval & lifecycle |
| **Executive** | Cross-domain synthesis, contradiction resolution, final decision orchestration |

### 4-Level Autonomous System

```
Level 0  Observe          →  AI monitors and records only
Level 1  Suggest          →  AI provides recommendations (default)
Level 2  Act (Confirm)    →  AI acts with your confirmation
Level 3  Full Autonomous  →  AI acts within safety bounds
```

Level escalation requires explicit Owner consent. Level 2+ changes are audit-logged. Sacred budget rules are enforced at **all levels** — even Level 0.

### 4-Layer Memory System

| Layer | TTL | Capacity | Purpose |
|-------|-----|----------|---------|
| **Short-term** | 24h | 100 entries | Recent context, session state, today's events |
| **Long-term** | 90d | 1,000 entries | Behavioral patterns, learned preferences |
| **Decision** | Permanent | 500 entries | Immutable audit trail of all decisions |
| **Emotional** | 30d | 200 entries | Stress/energy trends, wellness patterns |

### Financial Intelligence

- Multi-account support with `Decimal(14,2)` precision (checking, savings, investment, cash, credit)
- Budget rules with **sacred priority** — auto-veto on overspend, non-negotiable
- Emergency fund protection — Finance Agent never suggests non-essential withdrawals
- Financial goal tracking with deadline and progress monitoring
- AI-powered financial audit with anomaly detection and spending pattern analysis
- Atomic transactions via Prisma `$transaction()` for balance consistency

### Knowledge Vault

Single source of truth for AI reasoning. **Priority: Vault > Memory > Assumption.**

- 6 document types: note, pdf, image, audio, contract, rule
- Scope-based visibility: workspace, family, personal
- Member-level access control with alias-based permissions
- Rule-type documents treated as hard constraints by all agents

### Subscription System

- Three-tier pricing with Stripe Checkout integration
- Webhook-driven lifecycle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Feature limits enforced per tier (AI calls/day, vault docs, members, workspaces)
- 7-day free trial of Professional features on new workspaces

---

## Quick Start

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | 18+ | or Bun 1.x |
| **PostgreSQL** | 15+ | Required (SQLite not supported) |
| **Bun** | 1.x | Package manager & dev runtime |
| **Stripe CLI** | latest | For local webhook testing |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL URL, NextAuth secret, and Stripe keys

# 4. Set up the database
bun run db:generate   # Generate Prisma client
bun run db:push       # Sync schema to PostgreSQL

# 5. Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) — the onboarding wizard will guide you through account creation and workspace setup.

### Local Stripe Webhook Testing

```bash
# Install Stripe CLI, then forward webhook events:
stripe listen --forward-to localhost:3000/api/subscriptions/stripe-webhook

# Copy the whsec_... output to STRIPE_WEBHOOK_SECRET in your .env
```

---

## Architecture

Famlyzer AI follows a **server-first layered architecture** where all business logic, AI operations, and data mutations execute on the backend through Next.js API Routes. The frontend communicates exclusively via REST API — a zero-trust client model.

```
┌──────────────────────────────────────────────────────────┐
│  Client (SPA)                                            │
│  React 19 · Zustand · TanStack Query · shadcn/ui        │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS / REST
┌──────────────────────────▼───────────────────────────────┐
│  Next.js 16 Server (Standalone)                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Middleware (Edge) — JWT → RBAC → Route Matching    │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ API Routes — Auth · Validate · Execute · Respond   │  │
│  └──────┬─────────────────┬──────────────┬────────────┘  │
│  ┌──────▼────────┐ ┌──────▼──────┐ ┌─────▼─────────┐    │
│  │ Prisma ORM    │ │ z-ai-sdk    │ │ Stripe SDK    │    │
│  │ (PostgreSQL)  │ │ (7 Agents)  │ │ (Payments)    │    │
│  └──────┬────────┘ └─────────────┘ └───────────────┘    │
└─────────┼────────────────────────────────────────────────┘
┌──────────▼───────────────────────────────────────────────┐
│  PostgreSQL — 13 Models · 15 Enums · 30+ Indexes        │
└──────────────────────────────────────────────────────────┘
```

For the complete architecture document including data model diagrams, authentication flow, and security architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## API Overview

All 30 endpoints require JWT session authentication. Workspace-scoped routes verify membership before access. Every route enforces rate limiting and Zod input validation.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/setup` | Register new account (email, name, password) |
| `POST` | `/api/auth/signin` | NextAuth credentials sign-in |
| `GET` | `/api/user` | Get current authenticated user profile |

### Workspaces

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces` | Create a new workspace |
| `GET` | `/api/workspaces` | List all workspaces for current user |
| `PATCH` | `/api/workspaces/[id]` | Update workspace settings & autonomous level |

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces/[id]/members` | Add member to workspace |
| `GET` | `/api/workspaces/[id]/members` | List workspace members |
| `PATCH` | `/api/workspaces/[id]/members/[MemberId]` | Update member role/metadata |
| `DELETE` | `/api/workspaces/[id]/members/[MemberId]` | Remove member from workspace |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces/[id]/tasks` | Create task with resource costs |
| `GET` | `/api/workspaces/[id]/tasks` | List tasks (paginated, filterable) |
| `PATCH` | `/api/workspaces/[id]/tasks/[taskId]` | Update task status/priority/assignment |
| `DELETE` | `/api/workspaces/[id]/tasks/[taskId]` | Delete task |

### Finance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces/[id]/accounts` | Create financial account |
| `GET` | `/api/workspaces/[id]/accounts` | List accounts with balances |
| `POST` | `/api/workspaces/[id]/transactions` | Record transaction (atomic balance update) |
| `GET` | `/api/workspaces/[id]/transactions` | List transactions (paginated, filterable) |
| `POST` | `/api/workspaces/[id]/budget-rules` | Create budget rule with priority |
| `GET` | `/api/workspaces/[id]/budget-rules` | List active budget rules |
| `POST` | `/api/workspaces/[id]/financial-goals` | Create financial goal |
| `GET` | `/api/workspaces/[id]/financial-goals` | List goals with progress tracking |

### Knowledge Vault

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces/[id]/vault` | Create vault document (6 types) |
| `GET` | `/api/workspaces/[id]/vault` | List documents (filter by type, scope) |
| `PATCH` | `/api/workspaces/[id]/vault/[docId]` | Update document content/metadata |
| `DELETE` | `/api/workspaces/[id]/vault/[docId]` | Delete vault document |

### Memory & Suggestions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workspaces/[id]/memories` | Create memory entry (4 layers) |
| `GET` | `/api/workspaces/[id]/memories` | Retrieve memories (by layer, importance) |
| `DELETE` | `/api/workspaces/[id]/memories/[MemoryId]` | Delete memory entry |
| `GET` | `/api/workspaces/[id]/suggestions` | List AI suggestions (by status, agent) |
| `PATCH` | `/api/workspaces/[id]/suggestions/[suggestionId]` | Accept / simulate / ignore suggestion |
| `GET` | `/api/workspaces/[id]/agent-logs` | Audit trail of all AI actions |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | Multi-agent conversational AI |
| `POST` | `/api/ai/analyze` | Full workspace analysis |
| `POST` | `/api/ai/suggest` | Generate AI suggestions |
| `POST` | `/api/ai/optimize-schedule` | Schedule optimization (Planner Agent) |
| `POST` | `/api/ai/audit-finances` | Financial audit (Finance Agent) |
| `POST` | `/api/ai/agent-run` | Run specific agent with workspace context |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions` | List user subscriptions |
| `POST` | `/api/subscriptions` | Create subscription / Stripe checkout |
| `POST` | `/api/subscriptions/stripe-webhook` | Stripe webhook handler |

---

## AI Agents

All agents share the z-ai-web-dev-sdk provider but receive domain-specific system prompts, workspace context, and memory layer access. Every agent run follows the same execution pattern: fetch context → retrieve memories → construct prompt → invoke AI → persist AgentLog → create Memories → generate Suggestions.

| Agent | One-Line Description |
|-------|---------------------|
| **Planner** | Optimizes schedules and task assignments across time, energy, and money dimensions |
| **Finance** | Monitors budgets, enforces sacred rules with auto-veto, and detects spending anomalies |
| **Mediator** | Detects interpersonal conflicts and recommends compromises based on authority levels |
| **Health** | Tracks energy/stress trends and prevents burnout with rest and delegation suggestions |
| **Education** | Identifies skill gaps and optimizes learning investments against budget constraints |
| **Memory** | Manages the four-layer memory lifecycle, detects contradictions, and surfaces context |
| **Executive** | Synthesizes all agent outputs, resolves contradictions, and produces final recommendations |

**Agent Coordination Protocol** — When a full analysis runs, agents execute in sequence: Memory → Planner → Finance → Health → Education → Mediator → Executive. The Executive Agent runs last because it requires all other outputs, resolving contradictions via the principle hierarchy: *financial safety > health preservation > schedule integrity > preference alignment > optimization*.

---

## Subscription Pricing

| | **Free** | **Professional** | **Business** |
|---|---|---|---|
| **Price** | $0/mo | $19/mo or $190/yr | $49/mo or $490/yr |
| **Workspaces** | 1 (personal only) | 5 (personal + family) | Unlimited (all types) |
| **Members per Workspace** | 3 | 10 | Unlimited |
| **AI Calls / Day** | 10 | 100 | Unlimited |
| **Vault Documents** | 50 | 500 | Unlimited |
| **Memory Entries** | 100 | 1,000 | Unlimited |
| **Autonomous Level** | 1 (Suggest only) | 1–3 (Full range) | 1–3 (Full range) |
| **Agent Access** | Basic suggestions | All 7 agents + analysis | All 7 agents + executive |
| **Financial Audit** | — | Standard | Advanced |
| **API Access** | — | — | Included |
| **Support** | Community | Priority | Dedicated |
| **Trial** | 7-day Pro trial | — | — |

All plans include the 4-layer memory system, Knowledge Vault, and workspace-scoped data isolation. Yearly billing saves ~17%.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.1+ | SSR, API routes, standalone output |
| **Language** | TypeScript | 5.x | End-to-end type safety |
| **Runtime** | Bun | 1.x | Package manager & dev runtime |
| **UI** | React | 19.0 | Component model with concurrent features |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Components** | shadcn/ui (Radix) | latest | 50+ accessible UI primitives |
| **State** | Zustand | 5.0 | Global UI state |
| **Server State** | TanStack React Query | 5.82 | Caching, refetch, optimistic updates |
| **Data Tables** | TanStack React Table | 8.21 | Headless table with sorting/filtering |
| **Database** | PostgreSQL | 15+ | Production relational database |
| **ORM** | Prisma | 6.11 | Type-safe queries, migrations, schema |
| **Auth** | NextAuth.js | 4.24 | JWT sessions, credentials provider |
| **Validation** | Zod | 4.0 | Runtime input validation for all endpoints |
| **AI** | z-ai-web-dev-sdk | 0.0.17 | LLM completions with singleton + retry |
| **Payments** | Stripe | 22.1 | Checkout, webhooks, subscription management |
| **Charts** | Recharts | 2.15 | Financial dashboards & visualizations |
| **Animation** | Framer Motion | 12.x | Page transitions & micro-interactions |
| **Forms** | React Hook Form | 7.60 | Form state with Zod resolvers |
| **i18n** | next-intl | 4.3 | Internationalization framework |
| **Theme** | next-themes | 0.4 | Light/dark mode with system detection |
| **Toast** | Sonner | 2.0 | Notification system |
| **Password** | bcryptjs | 3.0 | Hashing with cost factor 12 |
| **Image** | sharp | 0.34 | Server-side image optimization |

---

## Project Structure

```
famlyzer-ai/
├── prisma/
│   └── schema.prisma              # 13 models, 15 enums, 30+ indexes
├── public/
│   ├── logo.svg                   # Application logo
│   └── robots.txt                 # Search engine directives
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/                # AI agent endpoints
│   │   │   │   ├── agent-run/     # Run specific agent
│   │   │   │   ├── analyze/       # Full workspace analysis
│   │   │   │   ├── audit-finances/# Financial audit
│   │   │   │   ├── chat/          # Conversational AI
│   │   │   │   ├── optimize-schedule/ # Schedule optimizer
│   │   │   │   └── suggest/       # Suggestion generator
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/ # NextAuth handler
│   │   │   │   └── setup/         # Registration endpoint
│   │   │   ├── subscriptions/
│   │   │   │   ├── route.ts       # Subscription CRUD
│   │   │   │   └── stripe-webhook/# Webhook handler
│   │   │   ├── user/              # Current user profile
│   │   │   └── workspaces/
│   │   │       ├── route.ts       # Workspace CRUD
│   │   │       └── [id]/
│   │   │           ├── accounts/  # Finance accounts
│   │   │           ├── agent-logs/# AI audit trail
│   │   │           ├── budget-rules/ # Budget rules
│   │   │           ├── financial-goals/ # Savings goals
│   │   │           ├── members/   # Member management
│   │   │           ├── memories/  # 4-layer memory
│   │   │           ├── suggestions/ # AI suggestions
│   │   │           ├── tasks/     # Task pipeline
│   │   │           ├── transactions/ # Transaction ledger
│   │   │           └── vault/     # Knowledge vault
│   │   ├── globals.css            # Tailwind + CSS variables
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # SPA entry point
│   ├── components/
│   │   ├── ui/                    # 50+ shadcn/ui primitives
│   │   ├── ai-assistant.tsx       # Multi-agent chat interface
│   │   ├── app-layout.tsx         # Sidebar + content shell
│   │   ├── dashboard.tsx          # Decision intelligence dashboard
│   │   ├── finance.tsx            # Budget tracker with auto-veto
│   │   ├── onboarding.tsx         # 4-step setup wizard
│   │   ├── planner.tsx            # Task pipeline with AI
│   │   ├── settings.tsx           # Workspace & subscription config
│   │   └── vault.tsx              # Knowledge vault management
│   ├── hooks/
│   │   ├── use-mobile.ts          # Responsive breakpoint hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   ├── ai.ts                  # z-ai-web-dev-sdk singleton + aiChat()
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── hooks.ts               # 30+ React Query hooks
│   │   ├── rate-limit.ts          # Sliding-window rate limiter
│   │   ├── stripe.ts              # Stripe helpers + pricing config
│   │   ├── store.ts               # Zustand global state
│   │   ├── utils.ts               # Utility functions (cn, etc.)
│   │   └── validations.ts         # Zod schemas for all endpoints
│   ├── middleware.ts              # Edge auth + workspace RBAC
│   └── types/
│       └── next-auth.d.ts         # NextAuth type extensions
├── .env.example                   # Environment variable template
├── ARCHITECTURE.md                # System architecture document
├── CHANGELOG.md                   # Version history
├── DESIGN.md                      # UI/UX design system
├── next.config.ts                 # Next.js config + security headers
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. All variables are required for production unless marked optional.

### Database & Auth

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing key (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | Base URL (`http://localhost:3000` in dev) |
| `NODE_ENV` | Yes | `development` or `production` |

### Stripe

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signing secret (`whsec_...`) |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Yes | Stripe Price ID for Pro monthly |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Yes | Stripe Price ID for Pro yearly |
| `STRIPE_BUSINESS_MONTHLY_PRICE_ID` | Yes | Stripe Price ID for Business monthly |
| `STRIPE_BUSINESS_YEARLY_PRICE_ID` | Yes | Stripe Price ID for Business yearly |

### Optional

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection for production rate limiting (`redis://localhost:6379`) |
| `S3_ENDPOINT` | S3-compatible endpoint for vault file storage |
| `S3_ACCESS_KEY` | S3 access key |
| `S3_SECRET_KEY` | S3 secret key |
| `S3_BUCKET` | S3 bucket name for vault files |

---

## Deployment

### Docker (Self-Hosted)

```dockerfile
# Dockerfile (standalone output)
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t famlyzer-ai .
docker run -p 3000:3000 --env-file .env famlyzer-ai
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
# STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
# STRIPE_PRO_MONTHLY_PRICE_ID, STRIPE_PRO_YEARLY_PRICE_ID,
# STRIPE_BUSINESS_MONTHLY_PRICE_ID, STRIPE_BUSINESS_YEARLY_PRICE_ID
```

> **Note:** Vercel serverless functions have a 10-second timeout by default. AI endpoints may require a Pro plan for extended timeouts. Set `maxDuration` in route handlers if needed.

### Self-Hosted (Bare Metal / VPS)

```bash
# 1. Clone and install
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai
bun install

# 2. Configure environment
cp .env.example .env
# Edit .env with production values

# 3. Build for production (standandalone output)
bun run db:generate
bun run build

# 4. Run with production server
bun run start
# or: NODE_ENV=production node .next/standalone/server.js
```

**Production checklist:**

- [ ] PostgreSQL 15+ with connection pooling (e.g., PgBouncer)
- [ ] `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` set to your production domain
- [ ] Stripe keys switched from `sk_test_` to `sk_live_`
- [ ] Stripe webhook endpoint configured in Stripe Dashboard
- [ ] Redis configured for production rate limiting (replace in-memory limiter)
- [ ] S3-compatible storage configured for vault file uploads
- [ ] Reverse proxy (Nginx/Caddy) with HTTPS termination
- [ ] Process manager (PM2/systemd) for automatic restarts
- [ ] Database backups configured (pg_dump cron or managed service)

---

## Contributing

This is a proprietary project. Contributions are managed internally.

### Development Workflow

1. **Branch**: Create a feature branch from `main` (`feat/your-feature`)
2. **Code**: Follow existing patterns — every API route must validate session, check rate limits, validate input with Zod, and enforce RBAC
3. **Lint**: Run `bun run lint` before committing — zero warnings required
4. **Types**: `noImplicitAny: true` is enforced — no `any` types
5. **Database**: Schema changes via `bun run db:push` (dev) or `bun run db:migrate` (production migrations)
6. **Commit**: Use conventional commit format (`feat:`, `fix:`, `chore:`, `docs:`)

### Code Standards

- **API Routes**: Every route follows the 4-step pattern — session → rate limit → validate → execute
- **Validation**: All input schemas in `src/lib/validations.ts` using Zod v4
- **State**: Server state via React Query hooks in `src/lib/hooks.ts`; UI state via Zustand in `src/lib/store.ts`
- **Components**: Feature components compose `shadcn/ui` primitives from `src/components/ui/`
- **AI**: All AI calls go through `aiChat()` in `src/lib/ai.ts` — never call the SDK directly
- **Security**: Client-side chat messages restricted to `user`/`assistant` roles; AI inputs sanitized via `sanitizeAiInput()`

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, data model, auth flow, security design |
| [DESIGN.md](DESIGN.md) | Product design, agent architecture, memory system, UI principles |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes (v1.0.0 → v4.0.0) |

---

## License

Proprietary — All rights reserved. Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

<div align="center">

*Famlyzer AI v4.0.0 — Reduce chaos. Increase clarity. Preserve harmony.*

</div>
