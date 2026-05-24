# Famlyzer AI — Production Architecture

> **Version 4.0.0** | Autonomous Decision & Planning Intelligence — Life, Family, Team, Finance SaaS Platform

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Layers](#3-architecture-layers)
4. [Data Model](#4-data-model)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Architecture](#6-api-architecture)
7. [AI Agent System](#7-ai-agent-system)
8. [Payment System](#8-payment-system)
9. [Security Architecture](#9-security-architecture)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Performance Optimizations](#11-performance-optimizations)
12. [Monitoring & Observability](#12-monitoring--observability)

---

## 1. System Overview

Famlyzer AI is a full-stack SaaS platform that provides autonomous AI-driven decision and planning intelligence for personal, family, and team contexts. The system operates on a **server-first architecture** where all business logic, AI operations, and data mutations execute on the backend through Next.js API Routes. The frontend is a single-page application that communicates exclusively via REST API calls, ensuring clean separation of concerns and a zero-trust client model.

The core value proposition centers on seven specialized AI agents that operate across four autonomous levels — from passive observation to full autonomous action — orchestrated by an Executive Agent that synthesizes cross-domain insights. Each workspace maintains its own isolated data context including financial accounts, tasks, vault documents, and a four-layer memory system (short-term, long-term, decision, emotional) that provides persistent context for AI reasoning over time.

The architecture supports three workspace types (personal, family, company) with multi-tenancy enforced at the database level through workspace-scoped foreign keys and validated at the middleware layer. A three-tier subscription model (Free, Professional at $19/mo, Business at $49/mo) gates feature access, AI call volume, and autonomous level capabilities via Stripe integration.

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                             │
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Dashboard │ │ Planner  │ │ Finance  │ │  Vault   │ │  AI Chat │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│       │             │            │             │             │        │
│  ┌────┴─────────────┴────────────┴─────────────┴─────────────┴──┐  │
│  │                   Zustand Global Store                        │  │
│  │    (currentUser, currentWorkspace, activeTab, sidebarOpen)    │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│  ┌───────────────────────────┴───────────────────────────────────┐  │
│  │               React Query Cache (TanStack v5)                 │  │
│  │   (workspaces, tasks, accounts, transactions, memories, ...)  │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ HTTPS / REST API
┌──────────────────────────────┼───────────────────────────────────────┐
│                              ▼     Next.js 16 Server (Standalone)    │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      Middleware (Edge)                         │  │
│  │   JWT Validation → Workspace Authorization → Route Matching   │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│                              │                                       │
│  ┌───────────────────────────┴───────────────────────────────────┐  │
│  │                     API Routes Layer                           │  │
│  │                                                               │  │
│  │  /api/auth/*        Authentication & registration             │  │
│  │  /api/user           Current user profile                     │  │
│  │  /api/workspaces/*   Workspace CRUD + members + data          │  │
│  │  /api/ai/*           AI chat, analyze, suggest, agents        │  │
│  │  /api/subscriptions  Stripe checkout & billing                │  │
│  │                                                               │  │
│  │  Every route enforces:                                        │  │
│  │    1. Session validation (getServerSession)                   │  │
│  │    2. Rate limiting (checkRateLimit)                          │  │
│  │    3. Input validation (Zod schemas)                          │  │
│  │    4. RBAC authorization (owner/admin/member)                 │  │
│  └───────┬───────────────────────┬───────────────────┬───────────┘  │
│          │                       │                   │               │
│  ┌───────┴────────┐  ┌──────────┴──────────┐  ┌────┴────────────┐  │
│  │  Prisma ORM    │  │  z-ai-web-dev-sdk   │  │  Stripe SDK     │  │
│  │  (PostgreSQL)  │  │  (AI Provider)      │  │  (Payments)     │  │
│  └───────┬────────┘  └─────────────────────┘  └─────────────────┘  │
│          │                                                          │
│  ┌───────┴────────────────────────────────────────────────────────┐ │
│  │                   PostgreSQL Database                          │ │
│  │                                                               │ │
│  │  Users │ Workspaces │ Members │ Tasks │ Transactions          │ │
│  │  Accounts │ BudgetRules │ Goals │ Vault │ Memories            │ │
│  │  Suggestions │ AgentLogs │ Subscriptions                       │ │
│  │                                                               │ │
│  │  13 Models · 15 Enums · 30+ Indexes · Cascade Deletes         │ │
│  └───────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

External Services:
  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐
  │  PostgreSQL     │  │  z-ai-web-dev-sdk │  │  Stripe API        │
  │  (Database)     │  │  (LLM Provider)   │  │  (Payment Gateway) │
  └─────────────────┘  └──────────────────┘  └────────────────────┘
```

---

## 2. Technology Stack

### Core Framework

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Full-Stack Framework** | Next.js (App Router) | 16.1+ | Server-side rendering, API routes, standalone output |
| **Language** | TypeScript | 5.x | End-to-end type safety across client and server |
| **Runtime** | Node.js / Bun | 18+ / 1.x | Production server / development toolchain |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.0 | UI component model with concurrent features |
| **Zustand** | 5.0 | Lightweight global state (user, workspace, UI state) |
| **TanStack React Query** | 5.82 | Server state caching, background refetch, optimistic updates |
| **TanStack React Table** | 8.21 | Headless data tables with sorting, filtering, pagination |
| **shadcn/ui** | latest | 50+ pre-built Radix UI components with Tailwind styling |
| **Tailwind CSS** | 4.x | Utility-first CSS with `@tailwindcss/postcss` plugin |
| **Framer Motion** | 12.x | Page transitions, staggered card entries, micro-interactions |
| **Recharts** | 2.15 | AreaChart, BarChart, PieChart for financial dashboards |
| **React Hook Form** | 7.60 | Form state management with `@hookform/resolvers` |
| **Lucide React** | 0.525 | Consistent icon system across 50+ icons |
| **date-fns** | 4.1 | Date formatting, manipulation, and calculations |
| **next-themes** | 0.4 | Light/dark mode with system preference detection |
| **next-intl** | 4.3 | Internationalization framework |
| **Sonner** | 2.0 | Toast notification system |
| **cmdk** | 1.1 | Command palette component |
| **sharp** | 0.34 | Server-side image optimization |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **NextAuth.js** | 4.24 | JWT-based session management, credentials provider |
| **Prisma ORM** | 6.11 | Type-safe database client, schema migrations, query builder |
| **PostgreSQL** | 15+ | Production relational database with JSONB support |
| **bcryptjs** | 3.0 | Password hashing with cost factor 12 |
| **Zod** | 4.0 | Runtime input validation for all API endpoints |
| **Stripe SDK** | 22.1 | Checkout sessions, webhook handling, subscription management |
| **z-ai-web-dev-sdk** | 0.0.17 | AI completions via singleton pattern with retry logic |
| **uuid** | 11.1 | Unique identifier generation |

### Development & Build

| Technology | Purpose |
|-----------|---------|
| **ESLint** (v9 + eslint-config-next) | Code quality and Next.js-specific linting |
| **PostCSS** (`@tailwindcss/postcss`) | CSS processing pipeline |
| **tw-animate-css** | Tailwind animation utilities |
| **Bun** | Package manager and development runtime |

---

## 3. Architecture Layers

Famlyzer AI follows a **layered architecture** pattern where each layer has a distinct responsibility and communicates only with adjacent layers. This separation ensures that business logic remains independent of infrastructure, and presentation concerns are cleanly isolated from data access.

### Presentation Layer

The presentation layer encompasses all client-side rendering and user interaction logic. Built on React 19 with the Next.js App Router, it follows a single-page application pattern where the root page (`src/app/page.tsx`) renders the `AppLayout` component, which manages tab-based navigation across six views: Dashboard, Planner, Finance, Vault, AI Assistant, and Settings.

Client state is managed through two complementary systems: **Zustand** handles global UI state (current user, active workspace, selected tab, sidebar visibility) with a minimal store interface, while **TanStack React Query** manages all server state through a centralized hooks layer (`src/lib/hooks.ts`) that exposes 30+ custom hooks for data fetching and mutations. React Query handles caching, background refetching, stale-while-revalidate, and automatic cache invalidation on mutations. Every mutation hook calls `qc.invalidateQueries()` on success to ensure related data stays consistent.

Component architecture follows a feature-based organization: top-level feature components (`dashboard.tsx`, `planner.tsx`, `finance.tsx`, `vault.tsx`, `ai-assistant.tsx`, `settings.tsx`) compose shadcn/ui primitives from `src/components/ui/`. Animations are applied uniformly via Framer Motion with staggered entry animations (`delay: index * 0.05`) and page transitions (`opacity: 0 → 1, y: 8 → 0`).

### Application Layer

The application layer implements all business logic through Next.js API Route Handlers. Each route follows a consistent four-step pattern: (1) session validation via `getServerSession(authOptions)`, (2) rate limit checking via `checkRateLimit()`, (3) input validation via Zod schema `.parse()`, and (4) business logic execution with Prisma database operations. This pattern is enforced uniformly across all 30 endpoints.

The application layer also houses the AI orchestration logic. Six AI endpoints (`/api/ai/chat`, `/api/ai/analyze`, `/api/ai/suggest`, `/api/ai/optimize-schedule`, `/api/ai/audit-finances`, `/api/ai/agent-run`) each gather workspace context from the database, construct structured prompts with the system prompt and agent-specific instructions, invoke the AI via the `aiChat()` function, and persist results as `AgentLog` and `Memory` entries. The `/api/ai/agent-run` endpoint is the most sophisticated, supporting all seven agent types with dynamic prompt composition based on agent type and workspace context.

Subscription management logic spans the `/api/subscriptions` and `/api/subscriptions/stripe-webhook` routes. The POST subscription endpoint handles free-tier creation directly and paid-tier creation via Stripe checkout sessions, while the webhook endpoint processes `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted` events, synchronizing database state with Stripe's source of truth.

### Domain Layer

The domain layer is expressed through the Prisma schema (`prisma/schema.prisma`), which defines 13 models, 15 enums, and the business rules they encode. Key domain concepts include:

- **Autonomous Levels** (0-3): Encoded as an integer on Workspace, controlling the permission boundary for AI actions. Level changes to 2+ are audit-logged.
- **Resource Costs**: Tasks carry `timeCost` (minutes), `energyCost` (0-100), and `moneyCost` (Decimal 12,2), enabling multi-dimensional optimization by the Planner and Finance agents.
- **Member Authority**: WorkspaceMember tracks `authorityLevel` (1-5), `energyLevel` (0-100), `stressLevel` (0-100), and JSON-encoded constraints/preferences/visibility for personalized AI reasoning.
- **Budget Priority**: The "sacred" level in BudgetPriority represents spending categories (like emergency funds) that the Finance Agent will veto against.
- **Memory Layers**: Four distinct layers with different TTLs and importance scoring enable the AI to maintain contextual awareness across conversation sessions.
- **Suggestion Lifecycle**: Suggestions flow through `pending → accepted | simulated | ignored` states, with each suggestion carrying `agentSource`, `type`, and `actionData` for traceability.

### Infrastructure Layer

The infrastructure layer provides the technical foundations that support all upper layers:

- **Database Access**: Prisma Client is instantiated as a global singleton (`src/lib/db.ts`) to prevent connection pool exhaustion in development. In production, the client logs only errors; in development, it logs queries, errors, and warnings.
- **AI SDK**: The z-ai-web-dev-sdk is initialized as a lazy singleton (`src/lib/ai.ts`) with deduplication of concurrent initialization attempts and automatic retry on failure. All AI calls race against a 30-second timeout.
- **Payment Gateway**: Stripe is lazily initialized (`src/lib/stripe.ts`) with typed configuration for API version `2026-04-22.dahlia`. All Stripe interactions go through typed helper functions.
- **Rate Limiting**: An in-memory sliding-window rate limiter (`src/lib/rate-limit.ts`) with automatic cleanup of expired entries every 5 minutes. Production deployments should replace this with Redis-backed rate limiting.
- **Validation**: All input schemas are centralized in `src/lib/validations.ts` using Zod v4, covering auth, workspace, task, finance, vault, memory, suggestion, subscription, and AI endpoints.

---

## 4. Data Model

The Famlyzer AI data model is implemented in Prisma ORM targeting PostgreSQL. It consists of 13 models, 15 enums, and 30+ database indexes optimized for the most common query patterns. All data is scoped to workspaces through foreign key relationships with cascade deletes, ensuring complete data isolation between tenants.

### Entity-Relationship Diagram

```
                          ┌──────────────┐
                          │     User     │
                          │──────────────│
                          │ id (CUID)    │
                          │ email (UQ)   │
                          │ name?        │
                          │ passwordHash?│
                          └──────┬───────┘
                                 │ 1:N
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
        ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
        │WorkspaceMember │  │Subscription  │  │              │
        │────────────────│  │──────────────│  │              │
        │ workspaceId FK │  │ userId FK    │  │              │
        │ userId FK      │  │ tier         │  │              │
        │ alias?         │  │ status       │  │              │
        │ authorityLevel │  │ stripeSubId? │  │              │
        │ energyLevel    │  │ stripeSessId?│  │              │
        │ stressLevel    │  └──────────────┘  │              │
        │ role           │                     │              │
        │ (UQ: ws+user)  │                     │              │
        └───────┬────────┘                     │              │
                │ N:1                          │              │
                ▼                              │              │
        ┌──────────────┐                       │              │
        │  Workspace   │◄──────────────────────┘              │
        │──────────────│                                      │
        │ id (CUID)    │                                      │
        │ name         │                                      │
        │ type         │◄─────── All below belong to          │
        │ autonomousLvl│        a workspace via FK            │
        │ subTier      │                                      │
        │ stripeCustId?│                                      │
        │ isActive     │                                      │
        └──────┬───────┘                                      │
               │                                              │
    ┌──────────┼──────────┬──────────┬──────────┬─────────────┤
    │          │          │          │          │             │
    ▼          ▼          ▼          ▼          ▼             ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐
│ Task   │ │Account │ │ Budget │ │  Goal  │ │  Vault  │ │Memory  │
│────────│ │────────│ │ Rule   │ │────────│ │  Doc    │ │────────│
│title   │ │name    │ │────────│ │name    │ │────────│ │layer   │
│priority│ │type    │ │category│ │target$ │ │title    │ │category│
│status  │ │balance │ │limit$  │ │current$│ │type     │ │content │
│timeCost│ │currency│ │period  │ │deadline│ │scope    │ │import- │
│energy$ │ │isEmerg │ │priority│ │priority│ │priority │ │ ance   │
│money$  │ └───┬────┘ │isActive│ └────────┘ │visibil. │ │expires?│
│assigned│     │      └────────┘            │tags     │ └────────┘
│ →Member│     ▼                            │metadata │
│dueDate?│ ┌────────┐                       └─────────┘
│aiRej?  │ │Trans-  │  ┌──────────┐  ┌──────────┐
└────────┘ │action  │  │Suggestion│  │AgentLog  │
           │────────│  │──────────│  │──────────│
           │amount  │  │type      │  │agentType │
           │category│  │agentSrc  │  │action    │
           │type    │  │title     │  │result    │
           │desc?   │  │reason    │  │reasoning │
           │date    │  │status    │  │autoLvl?  │
           │recur?  │  │actionData│  └──────────┘
           └────────┘  └──────────┘
```

### Model Details

#### User

The `User` model stores authentication identity and profile information. Passwords are stored as bcrypt hashes (cost factor 12) — never in plaintext. The `email` field has a unique constraint and index for fast lookup during authentication. Users participate in workspaces through the `WorkspaceMember` join table and hold subscriptions through the `Subscription` model.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `email` | String | @unique | Indexed, used for auth lookup |
| `name` | String? | Optional | Display name |
| `avatar` | String? | Optional | Avatar URL |
| `passwordHash` | String? | Optional | bcrypt hash, cost=12 |
| `createdAt` | DateTime | @default(now()) | Auto-set |
| `updatedAt` | DateTime | @updatedAt | Auto-updated |

**Relationships**: `workspaces` (WorkspaceMember[]), `subscriptions` (Subscription[])

#### Workspace

The `Workspace` model is the central entity in the data model — all domain data (tasks, accounts, transactions, goals, vault documents, memories, suggestions, agent logs) belongs to a workspace. This design ensures complete data isolation between tenants. The workspace also carries the autonomous level (0-3) and subscription tier that govern AI behavior and feature access.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `name` | String | Required | Display name |
| `type` | WorkspaceType | @default(personal) | personal / family / company |
| `autonomousLevel` | Int | @default(1) | 0=observe, 1=suggest, 2=act_with_confirm, 3=full_autonomous |
| `trialStart` | DateTime? | Optional | 7-day trial start timestamp |
| `trialEnd` | DateTime? | Optional | 7-day trial end timestamp |
| `subscriptionTier` | SubscriptionTier | @default(free) | free / professional / business |
| `stripeCustomerId` | String? | @unique | Stripe customer reference |
| `isActive` | Boolean | @default(true) | Soft-delete flag |

**Relationships**: `members`, `tasks`, `accounts`, `transactions`, `budgetRules`, `financialGoals`, `vaultDocuments`, `memories`, `suggestions`, `agentLogs` — all with cascade delete.

#### WorkspaceMember

The join table between User and Workspace with rich metadata. Each member has a role (owner/admin/member), an authority level (1-5) used by AI agents for decision hierarchy, and personal metrics (energy, stress, constraints, preferences) that agents use for personalized reasoning. The composite unique constraint `@@unique([workspaceId, userId])` ensures a user can only belong to a workspace once.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `userId` | String | FK → User | Cascade delete |
| `alias` | String? | Optional | e.g., "Ayah", "Ibu", "Manager" |
| `authorityLevel` | Int | @default(1) | 1-5 scale |
| `energyLevel` | Int | @default(70) | 0-100 scale |
| `stressLevel` | Int | @default(30) | 0-100 scale |
| `constraints` | Json? | Optional | Member-specific constraints |
| `preferences` | Json? | Optional | Member-specific preferences |
| `visibilityScope` | Json? | Optional | Data visibility rules |
| `role` | MemberRole | @default(member) | owner / admin / member |

**Indexes**: `workspaceId`, `userId`, `role`, `@@unique([workspaceId, userId])`

#### Task

The Task model implements a multi-dimensional resource tracking system. Each task carries time cost (minutes), energy cost (0-100), and money cost (Decimal 12,2), enabling the Planner Agent to optimize across all three dimensions simultaneously. Tasks can be assigned to workspace members and carry dependency chains. The AI rejection system (`aiRejected`, `aiRejectionReason`) allows autonomous agents to flag infeasible or dangerous tasks.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `title` | String | Required, max 200 | Task name |
| `description` | String? | Optional, max 2000 | Task details |
| `timeCost` | Int | @default(0) | Minutes |
| `energyCost` | Int | @default(0) | 0-100 scale |
| `moneyCost` | Decimal | @default(0) @db.Decimal(12,2) | Monetary cost |
| `priority` | TaskPriority | @default(medium) | low / medium / high / critical |
| `status` | TaskStatus | @default(pending) | pending / approved / rejected / done |
| `assignedToId` | String? | FK → WorkspaceMember | Set null on delete |
| `dependencies` | Json? | Optional | Array of task IDs |
| `dueDate` | DateTime? | Optional | Deadline |
| `completedAt` | DateTime? | Optional | Completion timestamp |
| `aiRejected` | Boolean | @default(false) | AI veto flag |
| `aiRejectionReason` | String? | Optional | AI explanation |

**Indexes**: `workspaceId`, `status`, `priority`, `assignedToId`, `dueDate`

#### FinanceAccount

Financial accounts track balances with Decimal(14,2) precision. The `isEmergency` flag designates emergency fund accounts that the Finance Agent treats as sacred — never suggesting withdrawals for non-essential expenses. Currency defaults to USD with a 3-character ISO 4217 code.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `name` | String | Required | Account display name |
| `type` | AccountType | @default(checking) | checking / savings / investment / cash / credit |
| `balance` | Decimal | @default(0) @db.Decimal(14,2) | Current balance |
| `currency` | String | @default("USD") @db.Char(3) | ISO 4217 code |
| `isEmergency` | Boolean | @default(false) | Protected by Finance Agent |

**Indexes**: `workspaceId`, `type`

#### Transaction

Transactions are the immutable ledger of financial activity. Each transaction is typed (income/expense/transfer), categorized (10 categories), and optionally linked to a finance account. The `isRecurring` flag supports subscription and recurring expense tracking. Transactions use Decimal(14,2) for precise monetary calculations.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `accountId` | String? | FK → FinanceAccount | Set null on delete |
| `amount` | Decimal | @db.Decimal(14,2) | Transaction amount |
| `category` | TransactionCategory | @default(other) | 10 categories |
| `type` | TransactionType | @default(expense) | income / expense / transfer |
| `description` | String? | Optional | Transaction note |
| `date` | DateTime | @default(now()) | Transaction date |
| `isRecurring` | Boolean | @default(false) | Recurring flag |

**Indexes**: `workspaceId`, `accountId`, `category`, `type`, `date`

#### BudgetRule

Budget rules define spending limits per category with configurable periods and priority levels. The "sacred" priority level represents non-negotiable budgets (e.g., emergency fund contributions, essential housing) that the Finance Agent will veto against when exceeded.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `category` | String | Required | Budget category |
| `limitAmount` | Decimal | @db.Decimal(12,2) | Spending limit |
| `period` | BudgetPeriod | @default(monthly) | weekly / monthly / yearly |
| `priority` | BudgetPriority | @default(medium) | low / medium / high / sacred |
| `isActive` | Boolean | @default(true) | Enable/disable |

**Indexes**: `workspaceId`, `category`, `isActive`

#### FinancialGoal

Financial goals track progress toward savings targets with deadline and priority tracking. The `currentAmount` field is updated as users allocate funds, and the AI uses goal progress to generate savings recommendations.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `name` | String | Required | Goal name |
| `targetAmount` | Decimal | @db.Decimal(14,2) | Target amount |
| `currentAmount` | Decimal | @default(0) @db.Decimal(14,2) | Current progress |
| `deadline` | DateTime? | Optional | Target date |
| `priority` | GoalPriority | @default(medium) | low / medium / high / critical |

**Indexes**: `workspaceId`, `priority`

#### VaultDocument

The Knowledge Vault stores AI-consumable knowledge in six document types (note, pdf, image, audio, contract, rule). Documents have scope-based visibility (workspace/family/personal) and member-level access controls. The AI always prioritizes Vault documents as the source of truth over memories or assumptions.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `title` | String | Required, max 200 | Document title |
| `type` | VaultDocType | @default(note) | note / pdf / image / audio / contract / rule |
| `content` | String? | @db.Text | Document content |
| `priority` | VaultPriority | @default(medium) | low / medium / high |
| `scope` | VaultScope | @default(workspace) | workspace / family / personal |
| `visibility` | Json? | Optional | Array of member aliases with access |
| `tags` | Json? | Optional | Tag array for categorization |
| `metadata` | Json? | Optional | Extra metadata |

**Indexes**: `workspaceId`, `type`, `scope`

#### Memory

The Memory model implements the four-layer memory system that gives AI agents persistent contextual awareness. Each memory has an importance score (1-10) used for retrieval prioritization and an optional expiration timestamp. Short-term memories (TTL: 24h) capture recent interactions, long-term memories (TTL: 90d) store behavioral patterns, decision memories persist indefinitely for audit trails, and emotional memories track stress/energy trends.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `layer` | MemoryLayer | @default(short_term) | short_term / long_term / decision / emotional |
| `category` | String? | Optional | e.g., "chat", "agent_planner" |
| `content` | String | @db.Text | Memory content |
| `importance` | Int | @default(5) | 1-10 scale |
| `expiresAt` | DateTime? | Optional | Auto-expiry for short-term |

**Indexes**: `workspaceId`, `layer`, `importance`, `expiresAt`

#### Suggestion

Suggestions are AI-generated recommendations with a tracked lifecycle. Each suggestion carries its source agent, type classification, reasoning, predicted consequences, and structured action data. The lifecycle flows from `pending` through `accepted`, `simulated`, or `ignored`, providing a complete audit trail of AI recommendations and user decisions.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `type` | SuggestionType | @default(preventive) | preventive / corrective / strategic / behavioral |
| `agentSource` | AgentType | Required | Source agent |
| `title` | String | Required | Suggestion title |
| `reason` | String | @db.Text | Why this suggestion was made |
| `consequence` | String? | @db.Text | Predicted outcome |
| `status` | SuggestionStatus | @default(pending) | pending / accepted / simulated / ignored |
| `actionData` | Json? | Optional | Structured action payload |

**Indexes**: `workspaceId`, `status`, `agentSource`

#### AgentLog

Agent logs provide a complete audit trail of all autonomous AI actions. Every agent run creates an AgentLog entry recording the agent type, action performed, result, reasoning, and the autonomous level at which the action was executed. This is critical for compliance, debugging, and the "explain reasoning when asked" principle.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `workspaceId` | String | FK → Workspace | Cascade delete |
| `agentType` | AgentType | Required | Which agent executed |
| `action` | String | Required | Action identifier |
| `result` | String? | @db.Text | Action result |
| `reasoning` | String? | @db.Text | Why the action was taken |
| `autonomousLevel` | Int? | Optional | Level at execution time |

**Indexes**: `workspaceId`, `agentType`, `createdAt`

#### Subscription

The Subscription model tracks billing state and links to Stripe's subscription system. Each subscription records the tier, status, pricing, billing period, and Stripe references. The `stripeSessionId` and `stripeSubId` fields provide the linkage to Stripe's checkout sessions and subscription objects for webhook correlation.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | String | @id @default(cuid()) | Primary key |
| `userId` | String | FK → User | Cascade delete |
| `tier` | SubscriptionTier | @default(free) | free / professional / business |
| `status` | SubscriptionStatus | @default(active) | active / cancelled / expired / past_due / trialing |
| `startDate` | DateTime | @default(now()) | Subscription start |
| `endDate` | DateTime? | Optional | Subscription end |
| `price` | Decimal | @default(0) @db.Decimal(10,2) | Price paid |
| `period` | SubscriptionPeriod | @default(monthly) | monthly / yearly |
| `stripeSessionId` | String? | @unique | Stripe checkout session |
| `stripeSubId` | String? | @unique | Stripe subscription ID |

**Indexes**: `userId`, `status`, `stripeSessionId`, `stripeSubId`

### Enums (15 Total)

| Enum | Values | Usage |
|------|--------|-------|
| `WorkspaceType` | personal, family, company | Workspace classification |
| `AutonomousLevel` | observe, suggest, act_with_confirm, full_autonomous | AI permission boundary |
| `MemberRole` | owner, admin, member | RBAC role |
| `TaskPriority` | low, medium, high, critical | Task urgency |
| `TaskStatus` | pending, approved, rejected, done | Task lifecycle |
| `AccountType` | checking, savings, investment, cash, credit | Financial account type |
| `TransactionCategory` | food, transport, housing, health, education, entertainment, salary, investment_return, transfer, other | Transaction classification |
| `TransactionType` | income, expense, transfer | Cashflow direction |
| `BudgetPeriod` | weekly, monthly, yearly | Budget time window |
| `BudgetPriority` | low, medium, high, sacred | Budget importance (sacred = non-negotiable) |
| `GoalPriority` | low, medium, high, critical | Goal importance |
| `VaultDocType` | note, pdf, image, audio, contract, rule | Document format |
| `VaultPriority` | low, medium, high | Document importance |
| `VaultScope` | workspace, family, personal | Access scope |
| `MemoryLayer` | short_term, long_term, decision, emotional | Memory classification |
| `SuggestionType` | preventive, corrective, strategic, behavioral | AI suggestion category |
| `SuggestionStatus` | pending, accepted, simulated, ignored | Suggestion lifecycle |
| `AgentType` | planner, finance, mediator, health, education, memory, executive | AI agent identity |
| `SubscriptionTier` | free, professional, business | Pricing tier |
| `SubscriptionStatus` | active, cancelled, expired, past_due, trialing | Billing lifecycle |
| `SubscriptionPeriod` | monthly, yearly | Billing frequency |

---

## 5. Authentication & Authorization

### Authentication Flow

Famlyzer AI uses **NextAuth.js v4** with the Credentials provider and JWT session strategy. The authentication flow is designed for email/password credentials with bcrypt password hashing.

```
Registration / Login Flow:
┌──────────┐     POST /api/auth/setup      ┌──────────────────┐
│  Client  │ ──────────────────────────────→ │  API Route       │
│          │ { email, name?, password }      │                  │
│          │                                 │ 1. Rate limit    │
│          │                                 │    (10/15min)    │
│          │                                 │ 2. Zod validate  │
│          │                                 │ 3. Check exists  │
│          │                                 │ 4. bcrypt hash   │
│          │                                 │    (cost=12)     │
│          │                                 │ 5. Create User   │
│          │ ←────────────────────────────── │ 6. Return user   │
└──────────┘    { user, workspaces }         └──────────────────┘

Session Login (NextAuth):
┌──────────┐    POST /api/auth/signin       ┌──────────────────┐
│  Client  │ ──────────────────────────────→ │  NextAuth        │
│          │ { email, password }            │  CredentialsProv │
│          │                                 │                  │
│          │                                 │ 1. Lookup user   │
│          │                                 │ 2. bcrypt.compare│
│          │                                 │ 3. Return user   │
│          │                                 │    object        │
│          │ ←────────────────────────────── │                  │
│          │ Set-Cookie: next-auth.session-  │  JWT created     │
│          │ token (HttpOnly, Secure)        │  maxAge: 7 days  │
└──────────┘                                 └──────────────────┘
```

**Key Configuration**:
- **Session Strategy**: JWT (not database sessions) for stateless horizontal scaling
- **Session Max Age**: 7 days (604,800 seconds)
- **JWT Max Age**: 7 days (matches session)
- **Password Hashing**: bcrypt with cost factor 12
- **Sign-in Page**: Root page (`/`) — the onboarding component serves as the sign-in form
- **Secret**: `NEXTAUTH_SECRET` environment variable (generated via `openssl rand -base64 32`)

### JWT Token Structure

The JWT token carries the user's ID and email, propagated through the `jwt` and `session` callbacks:

```typescript
// JWT callback — runs on sign-in and every subsequent request
async jwt({ token, user }) {
  if (user) {
    token.id = user.id       // CUID from database
    token.email = user.email
  }
  return token
}

// Session callback — exposes token data to client session
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string
    session.user.email = token.email as string
  }
  return session
}
```

The token is signed with `NEXTAUTH_SECRET` and stored in an `HttpOnly`, `Secure` cookie named `next-auth.session-token`. Custom TypeScript declarations in `src/types/next-auth.d.ts` extend the NextAuth types to include the `id` field on `Session.user` and `JWT`.

### RBAC Authorization Model

Famlyzer AI implements a three-tier role-based access control system at the workspace level:

| Role | Authority Level | Capabilities |
|------|----------------|-------------|
| **Owner** | 5 (default) | Full control: delete workspace, change autonomous level, manage members, all read/write |
| **Admin** | 3 (default) | Manage members, update workspace settings, all read/write, cannot delete workspace |
| **Member** | 1 (default) | Read workspace data, create tasks/transactions, use AI features, cannot manage members or settings |

Authorization is enforced at two layers:

1. **Middleware Layer** (`src/middleware.ts`): The Next.js Edge middleware validates JWT tokens for all API routes (except `/api/auth/*` and `GET /api`). When a workspace ID is present in the URL path (`/api/workspaces/:id/*`), the middleware queries the `WorkspaceMember` table to verify membership before allowing the request to proceed. Non-members receive a 403 Forbidden response.

2. **Route Handler Layer**: Individual route handlers perform additional role checks for sensitive operations. For example, workspace PATCH operations verify that the requesting user has `owner` or `admin` role. Autonomous level changes (level ≥ 2) are audit-logged through the `AgentLog` table.

### Middleware Pipeline

The middleware runs on the Edge runtime and applies to all routes matching `/api/:path*`:

```
Request → [Public Route Check] → [JWT Token Validation] → [Workspace Membership Check] → Next
              │                        │                         │
              ▼                        ▼                         ▼
         /api/auth/*             getToken()               findUnique({
         GET /api                No token → 401          workspaceId_userId })
                                                         Not member → 403
```

---

## 6. API Architecture

### Route Structure

The API follows Next.js App Router conventions with route handlers in `src/app/api/`. All routes use RESTful semantics with standard HTTP methods (GET, POST, PATCH, DELETE).

```
src/app/api/
├── route.ts                              GET  /api                    Health check
├── auth/
│   ├── [...nextauth]/route.ts            POST /api/auth/signin        NextAuth session
│   └── setup/route.ts                    POST /api/auth/setup         Register/login
├── user/route.ts                         GET  /api/user               Current user
├── workspaces/
│   ├── route.ts                          GET  /api/workspaces         List workspaces
│   │                                     POST /api/workspaces         Create workspace
│   └── [id]/
│       ├── route.ts                      GET  /api/workspaces/:id     Get workspace
│       │                                 PATCH /api/workspaces/:id    Update workspace
│       ├── members/
│       │   ├── route.ts                  GET  /api/workspaces/:id/members
│       │   │                             POST /api/workspaces/:id/members
│       │   └── [MemberId]/route.ts       PATCH /api/workspaces/:id/members/:memberId
│       ├── tasks/
│       │   ├── route.ts                  GET  /api/workspaces/:id/tasks
│       │   │                             POST /api/workspaces/:id/tasks
│       │   └── [taskId]/route.ts         PATCH /api/workspaces/:id/tasks/:taskId
│       │                                 DELETE /api/workspaces/:id/tasks/:taskId
│       ├── accounts/route.ts             GET  /api/workspaces/:id/accounts
│       │                                 POST /api/workspaces/:id/accounts
│       ├── transactions/route.ts         GET  /api/workspaces/:id/transactions
│       │                                 POST /api/workspaces/:id/transactions
│       ├── budget-rules/route.ts         GET  /api/workspaces/:id/budget-rules
│       │                                 POST /api/workspaces/:id/budget-rules
│       ├── financial-goals/route.ts      GET  /api/workspaces/:id/financial-goals
│       │                                 POST /api/workspaces/:id/financial-goals
│       ├── vault/
│       │   ├── route.ts                  GET  /api/workspaces/:id/vault
│       │   │                             POST /api/workspaces/:id/vault
│       │   └── [docId]/route.ts          PATCH /api/workspaces/:id/vault/:docId
│       │                                 DELETE /api/workspaces/:id/vault/:docId
│       ├── memories/
│       │   ├── route.ts                  GET  /api/workspaces/:id/memories
│       │   │                             POST /api/workspaces/:id/memories
│       │   └── [MemoryId]/route.ts       DELETE /api/workspaces/:id/memories/:memoryId
│       ├── suggestions/
│       │   ├── route.ts                  GET  /api/workspaces/:id/suggestions
│       │   └── [suggestionId]/route.ts   PATCH /api/workspaces/:id/suggestions/:id
│       └── agent-logs/route.ts           GET  /api/workspaces/:id/agent-logs
├── ai/
│   ├── chat/route.ts                     POST /api/ai/chat
│   ├── analyze/route.ts                  POST /api/ai/analyze
│   ├── suggest/route.ts                  POST /api/ai/suggest
│   ├── optimize-schedule/route.ts        POST /api/ai/optimize-schedule
│   ├── audit-finances/route.ts           POST /api/ai/audit-finances
│   └── agent-run/route.ts                POST /api/ai/agent-run
└── subscriptions/
    ├── route.ts                          GET  /api/subscriptions
    │                                     POST /api/subscriptions
    └── stripe-webhook/route.ts           POST /api/subscriptions/stripe-webhook
```

### Request Lifecycle

Every API request follows a consistent lifecycle through four enforcement layers:

```
HTTP Request
    │
    ▼
1. Middleware (Edge Runtime)
    ├── Public route check → skip auth for /api/auth/*
    ├── JWT validation via getToken()
    └── Workspace membership check for /api/workspaces/:id/*
    │
    ▼
2. Route Handler — Authentication
    └── getServerSession(authOptions) → 401 if no session
    │
    ▼
3. Route Handler — Rate Limiting
    └── checkRateLimit(userId, RATE_LIMITS.*) → 429 if exceeded
    │
    ▼
4. Route Handler — Input Validation
    └── zodSchema.parse(body) → 400 if invalid
    │
    ▼
5. Business Logic
    ├── Prisma queries
    ├── AI operations
    └── Stripe operations
    │
    ▼
HTTP Response (JSON)
```

### Validation System

All API inputs are validated using Zod v4 schemas centralized in `src/lib/validations.ts`. The validation system covers:

| Category | Schema | Key Constraints |
|----------|--------|----------------|
| Auth Setup | `authSetupSchema` | email format, password 8-128 chars |
| Auth Login | `authLoginSchema` | email format, password required |
| Create Workspace | `createWorkspaceSchema` | name 1-100 chars, type enum, userId CUID |
| Update Workspace | `updateWorkspaceSchema` | autonomousLevel 0-3 |
| Add Member | `addMemberSchema` | authorityLevel 1-5, role enum |
| Update Member | `updateMemberSchema` | energyLevel 0-100, stressLevel 0-100 |
| Create Task | `createTaskSchema` | title 1-200 chars, timeCost max 10080 min, moneyCost max 1M |
| Create Account | `createAccountSchema` | balance ±10M, currency ISO 4217 (3 chars) |
| Create Transaction | `createTransactionSchema` | amount ±100M, 10 categories |
| Create Budget Rule | `createBudgetRuleSchema` | limitAmount max 10M, 4 priorities |
| Create Goal | `createFinancialGoalSchema` | targetAmount max 100M |
| Create Vault Doc | `createVaultDocumentSchema` | content max 100K chars |
| Create Memory | `createMemorySchema` | content 1-10K chars, importance 1-10 |
| AI Chat | `aiChatSchema` | messages 1-50, content max 5K, role: user/assistant only |
| AI Agent Run | `aiAgentRunSchema` | 7 agent types, input max 5K |
| Pagination | `paginationSchema` | page ≥1, limit 1-100 (default 50) |

### Rate Limiting

Rate limiting is implemented as a sliding-window counter per identifier (user ID or IP address). Six preset configurations cover different endpoint categories:

| Preset | Window | Max Requests | Applied To |
|--------|--------|-------------|------------|
| `AI_CHAT` | 60s | 20 | `/api/ai/chat` |
| `AI_ANALYZE` | 60s | 10 | `/api/ai/analyze` |
| `AI_AGENT_RUN` | 60s | 5 | `/api/ai/agent-run` |
| `AI_SUGGEST` | 60s | 10 | `/api/ai/suggest` |
| `AI_OPTIMIZE` | 60s | 10 | `/api/ai/optimize-schedule` |
| `AI_AUDIT` | 60s | 10 | `/api/ai/audit-finances` |
| `API_STANDARD` | 60s | 60 | GET endpoints |
| `API_WRITE` | 60s | 30 | POST/PATCH/DELETE endpoints |
| `API_AUTH` | 15min | 10 | `/api/auth/setup` (brute force protection) |

When rate limited, the API returns `429 Too Many Requests` with the response body `{ error: 'Rate limit exceeded' }`. The current implementation uses an in-memory store with 5-minute cleanup intervals. **Production deployments should migrate to Redis-backed rate limiting** (e.g., `@upstash/ratelimit`) for multi-instance consistency.

### Pagination

List endpoints support offset-based pagination with the `paginationSchema`:

```typescript
// Request: GET /api/workspaces/:id/tasks?page=2&limit=20
// Response:
{
  "data": [...tasks],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 87,
    "pages": 5
  }
}
```

Query parameters: `page` (default 1), `limit` (default 50, max 100). Filter parameters (`status`, `priority`, `category`, `type`, `scope`, `layer`) are also supported on relevant endpoints.

### Error Handling

All API routes follow a consistent error response format:

| Status Code | Condition | Response Body |
|-------------|-----------|---------------|
| 400 | Zod validation failure | `{ error: 'Validation failed', details: ... }` |
| 401 | No session / invalid token | `{ error: 'Authentication required' }` or `{ error: 'Unauthorized' }` |
| 403 | Insufficient permissions | `{ error: 'Access denied: not a workspace member' }` |
| 404 | Resource not found | `{ error: 'Workspace not found' }` |
| 429 | Rate limit exceeded | `{ error: 'Rate limit exceeded' }` |
| 500 | Server error | `{ error: 'Failed to [operation]' }` |

---

## 7. AI Agent System

### Overview

The AI Agent System is the core intelligence layer of Famlyzer AI. It consists of seven specialized agents, each with a distinct domain responsibility, that operate within a four-level autonomous permission framework. All AI interactions are mediated through the z-ai-web-dev-sdk, running exclusively on the server to protect API keys and ensure data integrity.

### Agent Architecture

```
                    ┌──────────────────────┐
                    │    Executive Agent    │
                    │    (Orchestrator)     │
                    │                      │
                    │  • Cross-domain      │
                    │    decision making   │
                    │  • Agent dispatch    │
                    │  • Final authority   │
                    │  • Strategic planning│
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
   │   Planner   │     │   Finance   │     │  Mediator   │
   │   Agent     │     │   Agent     │     │   Agent     │
   │             │     │             │     │             │
   │ • Schedule  │     │ • Budgets   │     │ • Conflict  │
   │ • Time opt  │     │ • Cashflow  │     │ • Harmony   │
   │ • Resources │     │ • Risk mgmt │     │ • Resources │
   │ • Deadlines │     │ • Veto power│     │ • Comm.     │
   └─────────────┘     └─────────────┘     └─────────────┘
          │                    │                    │
   ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
   │   Health    │     │  Education  │     │   Memory    │
   │   Agent     │     │   Agent     │     │   Agent     │
   │             │     │             │     │             │
   │ • Wellness  │     │ • Skills    │     │ • Recall    │
   │ • Stress    │     │ • Learning  │     │ • Patterns  │
   │ • Burnout   │     │ • Knowledge │     │ • Consist.  │
   │ • Balance   │     │ • Dev paths │     │ • Compress  │
   └─────────────┘     └─────────────┘     └─────────────┘
```

### Agent Specifications

| Agent | Domain | System Prompt Focus | Autonomous Actions |
|-------|--------|--------------------|--------------------|
| **Planner** | Time & scheduling | Task scheduling, time optimization, resource allocation | Reschedule tasks, reject infeasible tasks, reassign based on energy |
| **Finance** | Money & budgets | Budgets, savings, investments, financial risk management | Veto overspending, flag risky transactions, enforce sacred budgets |
| **Mediator** | People & harmony | Family/team harmony, conflict resolution, communication | Suggest resolutions, reallocate disputed resources, flag tensions |
| **Health** | Wellness & energy | Wellness, stress management, work-life balance | Warn about overload, suggest rest periods, recommend breaks |
| **Education** | Learning & growth | Learning goals, skill development, knowledge management | Recommend development paths, identify skill gaps |
| **Memory** | Knowledge & context | Organizing memories, insights, knowledge retrieval | Flag inconsistencies, compress old memories, promote important items |
| **Executive** | Strategy & decisions | Cross-domain authority, high-level strategic decisions | Execute autonomous decisions, orchestrate other agents, final authority |

### Agent Execution Flow

When an agent is invoked (via `/api/ai/agent-run`), the following sequence executes:

```
1. Session Validation
   └── getServerSession() → 401 if unauthorized

2. Rate Limiting
   └── checkRateLimit(userId, AI_AGENT_RUN) → 429 if exceeded
       (5 requests/minute — most restrictive rate limit)

3. Input Validation
   └── aiAgentRunSchema.parse(body) → validates workspaceId + agentType

4. Context Gathering (parallel queries)
   ├── WorkspaceMember.findMany (top 10, for member context)
   ├── Task.findMany (top 20, pending/approved, for task context)
   ├── FinanceAccount.findMany (all, for financial context)
   └── Memory.findMany (top 10, importance ≥ 7, for memory context)

5. Prompt Construction
   ├── System prompt: SYSTEM_PROMPT + agent-specific AGENT_PROMPTS[agentType]
   └── User message: workspace context JSON + sanitized user input

6. AI Invocation
   └── aiChat(messages, { maxTokens: 2048 }) → races against 30s timeout

7. Result Persistence (parallel writes)
   ├── AgentLog.create → audit trail with agent type, action, result
   └── Memory.create → short_term layer, importance=6, TTL=24h

8. Response
   └── { result: content, logId: agentLog.id }
```

### Memory System

The four-layer memory system provides persistent contextual awareness across sessions:

```
┌─────────────────────────────────────────────────────┐
│                  Memory Hierarchy                    │
│                                                     │
│  ┌────────────────┐  Layer: short_term              │
│  │  Short-term    │  TTL: 24 hours                  │
│  │  Memory        │  Default importance: 3-6         │
│  │                │  Purpose: Recent interactions,   │
│  │                │  chat context, agent results     │
│  └───────┬────────┘                                 │
│          │ Promotes to (importance ≥ 7)              │
│  ┌───────┴────────┐  Layer: long_term               │
│  │  Long-term     │  TTL: 90 days                   │
│  │  Memory        │  Purpose: Behavioral patterns,  │
│  │                │  recurring events, habits        │
│  └───────┬────────┘                                 │
│          │                                          │
│  ┌───────┴────────┐  Layer: decision                │
│  │  Decision      │  TTL: None (permanent)          │
│  │  History       │  Purpose: Past choices and      │
│  │                │  outcomes, audit trail           │
│  └───────┬────────┘                                 │
│          │                                          │
│  ┌───────┴────────┐  Layer: emotional               │
│  │  Emotional     │  TTL: None (optional)           │
│  │  Patterns      │  Purpose: Stress trends, energy │
│  │                │  cycles, mood patterns           │
│  └────────────────┘                                 │
│                                                     │
│  Retrieval Priority:                                │
│  1. Vault documents (source of truth)               │
│  2. Decision memories (verified past choices)       │
│  3. Long-term memories (established patterns)       │
│  4. Short-term memories (recent context)            │
│  5. Emotional patterns (supplementary)              │
└─────────────────────────────────────────────────────┘
```

Agent runs automatically store results as short-term memories with 24-hour TTL and importance score of 6. High-importance memories (≥7) are prioritized for retrieval in subsequent agent runs, creating a self-reinforcing knowledge accumulation cycle.

### Autonomous Levels

The autonomous level is a per-workspace setting that defines the boundary of AI agency:

| Level | Name | AI Behavior | User Interaction Required |
|-------|------|-------------|--------------------------|
| **0** | Observe | AI only monitors workspace data and records observations to memory. No suggestions or actions generated. | None — passive mode |
| **1** | Suggest | AI generates recommendations (Suggestion records with `status: pending`). No actions taken without user approval. | User must accept/ignore each suggestion |
| **2** | Act with Confirm | AI prepares actions and presents them for confirmation. Actions include task reassignment, budget alerts, schedule changes. | User must confirm each action before execution |
| **3** | Full Autonomous | AI acts independently within safety boundaries. Can execute tasks, adjust schedules, flag transactions. Emergency fund and sacred budgets are always protected. | None — AI operates independently. All actions logged for audit. |

**Safety Guardrails at Level 3**:
- Emergency funds are always sacred — AI cannot suggest or execute withdrawals
- Sacred budget categories cannot be overridden
- All autonomous actions are logged to `AgentLog` with reasoning
- Autonomous level changes to ≥2 require audit logging
- Financial veto power remains active regardless of autonomous level

### AI SDK Architecture

The AI SDK layer (`src/lib/ai.ts`) implements several production-grade patterns:

1. **Singleton Initialization**: The ZAI instance is created once and reused across requests. Concurrent initialization attempts are deduplicated via a shared promise (`zaiInitPromise`), preventing race conditions during cold starts.

2. **Timeout Protection**: Every AI call races against a configurable timeout (default 30 seconds) using `Promise.race()`. This prevents indefinite hangs from slow AI responses.

3. **Prompt Injection Prevention**: The `sanitizeAiInput()` function strips common injection patterns before user input reaches the AI:
   - HTML-like tags: `<system>`, `<instruction>`, `<prompt>`, `<ignore>`
   - Instruction overrides: "ignore previous instructions", "ignore above instructions"
   - Role manipulation: "you are now", "act as", "pretend to be"
   - Input length is capped at 5,000 characters by default

4. **Client-Side Role Restriction**: The `aiChatSchema` validation explicitly only allows `user` and `assistant` roles from the client — the `system` role is never accepted from client input and is always constructed server-side.

5. **System Prompt**: A fixed system prompt defines the AI's identity and operating principles:
   - Think systematically
   - Respect financial, time, and energy constraints
   - Use Knowledge Vault as source of truth
   - Maintain long-term stability
   - Act autonomously only within permission
   - Explain reasoning when asked
   - Never invent facts outside Vault
   - Simulate before deciding
   - Prefer lowest long-term risk
   - Protect financial safety above comfort

---

## 8. Payment System

### Stripe Integration Overview

Famlyzer AI integrates Stripe for subscription billing via Checkout Sessions and Webhooks. The payment flow follows a server-driven pattern where the API creates Stripe checkout sessions, redirects users to Stripe-hosted payment pages, and processes webhook events to synchronize subscription state.

### Pricing Tiers

| Tier | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| **Free** | $0 | $0 | — |
| **Professional** | $19/mo | $190/yr | 17% ($15.83/mo) |
| **Business** | $49/mo | $490/yr | 17% ($40.83/mo) |

### Tier Feature Matrix

| Feature | Free | Professional | Business |
|---------|------|-------------|----------|
| Workspace types | Personal only | Personal + Family | All (incl. Company) |
| Max workspaces | 1 | 5 | Unlimited |
| Max members/workspace | 3 | 10 | Unlimited |
| AI calls/day | 10 | 100 | Unlimited |
| Vault documents | 50 | 500 | Unlimited |
| Memories | 100 | 1,000 | Unlimited |
| Autonomous levels | 0-1 | 0-3 | 0-3 |
| Executive agent | — | Yes | Yes |
| Full autonomous mode | — | Yes | Yes |
| Advanced financial audit | — | Yes | Yes |
| API access | — | — | Yes |
| Dedicated support | — | — | Yes |
| Trial | 7-day Professional trial | — | — |

### Checkout Flow

```
┌──────────┐                                  ┌──────────┐
│  Client  │                                  │  Server  │
└────┬─────┘                                  └────┬─────┘
     │  POST /api/subscriptions                    │
     │  { tier: 'professional', period: 'monthly' }│
     │ ─────────────────────────────────────────→  │
     │                                             │ 1. Validate session
     │                                             │ 2. Rate limit check
     │                                             │ 3. Zod validate input
     │                                             │ 4. Find workspace
     │                                             │ 5. Get/create Stripe
     │                                             │    customer
     │                                             │ 6. Create checkout
     │                                             │    session
     │  { checkoutUrl, sessionId }                  │
     │ ←─────────────────────────────────────────  │
     │                                             │
     │  Redirect to Stripe Checkout                │
     │ ──────────────────────────────────────→     │
     │                                             │
     │           [User completes payment]           │
     │                                             │
     │  Stripe Webhook: checkout.session.completed  │
     │ ─────────────────────────────────────────→  │
     │                                             │ 1. Verify signature
     │                                             │ 2. Parse event
     │                                             │ 3. Upsert subscription
     │                                             │ 4. Update workspace tier
     │  { received: true }                          │
     │ ←─────────────────────────────────────────  │
     │                                             │
     │  Redirect to /?checkout=success             │
     │ ←────────────────────────────────────────── │
```

### Webhook Event Handling

The Stripe webhook endpoint (`/api/subscriptions/stripe-webhook`) processes three event types:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Upsert subscription record with tier, status=active, price, period, Stripe IDs. Update workspace `subscriptionTier`. Calculate `endDate` based on period. |
| `customer.subscription.updated` | Update subscription status: `active` if Stripe status is active, otherwise `past_due`. |
| `customer.subscription.deleted` | Set subscription status to `cancelled`. Downgrade workspace `subscriptionTier` to `free`. |

**Webhook Security**: The raw request body is passed to `stripe.webhooks.constructEvent()` along with the `stripe-signature` header and `STRIPE_WEBHOOK_SECRET` for signature verification. This prevents forged webhook attacks.

### Subscription Lifecycle

```
  [New User] ──→ Free Tier (auto-assigned)
       │
       │  Upgrades via checkout
       ▼
  Professional/Business ──→ Active
       │                        │
       │  Payment failure       │  User cancels
       ▼                        ▼
  Past Due ──→ Stripe retry ──→ Active (recovered)
       │
       │  Retry fails
       ▼
  Cancelled ──→ Downgrade to Free
```

### Stripe Configuration

```typescript
// Lazy-initialized Stripe singleton
getStripe() → new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

// Environment variables required:
STRIPE_SECRET_KEY           // sk_test_... / sk_live_...
STRIPE_PUBLISHABLE_KEY      // pk_test_... / pk_live_...
STRIPE_WEBHOOK_SECRET       // whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID // price_...
STRIPE_PRO_YEARLY_PRICE_ID  // price_...
STRIPE_BUSINESS_MONTHLY_PRICE_ID // price_...
STRIPE_BUSINESS_YEARLY_PRICE_ID  // price_...
```

---

## 9. Security Architecture

Famlyzer AI implements a multi-layered security model aligned with OWASP best practices. Security is enforced at every layer from HTTP headers to database queries.

### Security Headers

All responses include security headers configured in `next.config.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevent clickjacking via iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer information leakage |
| `X-DNS-Prefetch-Control` | `on` | Enable DNS prefetching for performance |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unnecessary browser APIs |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS filter |

Additionally, `poweredByHeader: false` removes the `X-Powered-By: Next.js` header, reducing information disclosure.

### Authentication Security

| Measure | Implementation | Purpose |
|---------|---------------|---------|
| Password hashing | bcrypt, cost factor 12 | Resistant to brute-force and rainbow table attacks |
| JWT sessions | HS256 signed, 7-day expiry | Stateless authentication without server-side session store |
| HttpOnly cookies | NextAuth default | Prevent XSS-based token theft |
| Secure cookies | Enabled in production | Prevent token interception on HTTP |
| Auth rate limiting | 10 attempts per 15 minutes | Brute-force protection on login endpoint |
| Generic error messages | "Invalid email or password" | Prevent user enumeration attacks |

### Authorization Security

| Measure | Implementation | Purpose |
|---------|---------------|---------|
| Middleware auth check | `getToken()` on all API routes | Enforce authentication at the edge |
| Workspace membership check | Database query in middleware | Verify tenant access before data retrieval |
| Role-based access control | owner/admin/member roles | Granular permission enforcement in route handlers |
| User ID override | `userId: session.user.id` on create | Prevent user impersonation (never trust client-sent userId) |

### Input Validation

All API inputs pass through Zod v4 schema validation before reaching business logic:

- **Type enforcement**: All fields have strict type constraints (string, number, boolean, enum)
- **Length limits**: Strings are bounded (email, title, content) to prevent buffer overflow and storage abuse
- **Range constraints**: Numbers are bounded (amounts ±100M, energy 0-100, authority 1-5)
- **Enum validation**: All categorical fields use strict enum validation (role, type, status, priority)
- **SQL injection prevention**: Prisma ORM uses parameterized queries by default
- **XSS prevention**: React automatically escapes rendered content; Zod validates input structure

### AI-Specific Security

| Threat | Mitigation | Implementation |
|--------|-----------|---------------|
| Prompt injection | Input sanitization | `sanitizeAiInput()` strips injection patterns and caps length at 5,000 chars |
| System role injection | Client role restriction | `aiChatSchema` only allows `user`/`assistant` roles — never `system` |
| Data exfiltration via AI | Server-side only | All AI calls run server-side; API keys never exposed to client |
| Unauthorized AI access | Workspace membership check | AI endpoints require workspace membership validated in middleware |
| AI action abuse | Autonomous level gating | Workspace `autonomousLevel` controls AI permission boundary |
| Audit trail gaps | Agent logging | All AI actions create `AgentLog` entries with reasoning |

### Prompt Injection Prevention

The `sanitizeAiInput()` function applies three layers of defense:

1. **Length restriction**: Input is truncated to `maxLength` (default 5,000 characters)
2. **Tag stripping**: HTML-like tags targeting system instructions are replaced with `[filtered]`:
   - `<system>`, `<instruction>`, `<prompt>`, `<ignore>` and variants with whitespace
3. **Pattern replacement**: Common injection phrases are replaced with `[filtered]`:
   - "ignore previous/above/all instructions"
   - "you are now", "act as", "pretend to be"

### Rate Limiting

| Endpoint Category | Rate Limit | Rationale |
|-------------------|-----------|-----------|
| AI Chat | 20/min | AI calls are expensive; prevent abuse |
| AI Analyze | 10/min | Heavy computation with large context |
| AI Agent Run | 5/min | Most resource-intensive; strictest limit |
| AI Suggest | 10/min | Moderate AI usage |
| AI Optimize | 10/min | Moderate AI usage |
| AI Audit | 10/min | Moderate AI usage |
| Standard API | 60/min | Normal CRUD operations |
| Write API | 30/min | Mutation operations |
| Auth | 10/15min | Brute-force protection |

Rate limit identifiers are based on user ID for authenticated requests and client IP (`x-forwarded-for`) for auth endpoints. When exceeded, the API returns `429 Too Many Requests`.

### Data Isolation

- **Workspace scoping**: All data queries include `workspaceId` in the `where` clause
- **Membership verification**: Middleware checks workspace membership before allowing any data access
- **Cascade deletes**: All workspace data is cascade-deleted when a workspace is removed
- **Unique constraints**: `@@unique([workspaceId, userId])` prevents duplicate memberships

---

## 10. Deployment Architecture

### Build Configuration

Famlyzer AI is configured for **standalone output** mode, which produces a self-contained build that includes only the necessary files for production deployment:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",    // Produces .next/standalone/ directory
  reactStrictMode: true,   // Enable React strict mode
  poweredByHeader: false,  // Remove X-Powered-By header
}
```

The build script copies static assets and public files into the standalone directory:

```bash
# Build process
next build                                    # Generate .next/standalone/
cp -r .next/static .next/standalone/.next/    # Copy static assets
cp -r public .next/standalone/                 # Copy public files
```

### Production Startup

```bash
NODE_ENV=production bun .next/standalone/server.js
```

The standalone server runs a minimal Node.js HTTP server that serves the Next.js application without requiring the full `node_modules` directory, significantly reducing deployment size.

### Database Setup

```bash
# Development
prisma db push          # Sync schema without migrations
prisma generate         # Generate Prisma Client

# Production
prisma migrate deploy   # Apply pending migrations
prisma generate         # Generate Prisma Client
```

### Docker-Ready Deployment

The standalone output mode is designed for containerized deployment:

```dockerfile
# Conceptual Dockerfile
FROM node:20-slim

# Install Prisma dependencies
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy standalone build
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret (openssl rand -base64 32) |
| `NEXTAUTH_URL` | Yes | Public URL of the deployment |
| `STRIPE_SECRET_KEY` | Yes | Stripe API secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Yes | Stripe price ID for Professional monthly |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Yes | Stripe price ID for Professional yearly |
| `STRIPE_BUSINESS_MONTHLY_PRICE_ID` | Yes | Stripe price ID for Business monthly |
| `STRIPE_BUSINESS_YEARLY_PRICE_ID` | Yes | Stripe price ID for Business yearly |
| `NODE_ENV` | Yes | `production` or `development` |
| `REDIS_URL` | No | Redis for production rate limiting |
| `S3_ENDPOINT` | No | S3-compatible storage for vault files |
| `S3_ACCESS_KEY` | No | S3 access key |
| `S3_SECRET_KEY` | No | S3 secret key |
| `S3_BUCKET` | No | S3 bucket name |

### Infrastructure Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 1 vCPU | 2 vCPU |
| **RAM** | 512 MB | 1 GB |
| **PostgreSQL** | 15+ | 16+ with connection pooling |
| **Disk** | 1 GB | 10 GB (with vault files) |
| **Network** | Outbound HTTPS to Stripe + AI API | Same |

### Horizontal Scaling Considerations

The architecture supports horizontal scaling with the following caveats:

- **Stateless API routes**: All routes are stateless (JWT sessions), enabling load balancing across multiple instances
- **Rate limiting**: The current in-memory rate limiter is **not shared across instances**. For multi-instance deployments, replace with `@upstash/ratelimit` (Redis-backed) or a similar distributed rate limiting solution
- **Database connections**: Prisma Client uses a connection pool (default: 5 connections). For high-traffic deployments, configure `connection_limit` in the `DATABASE_URL` and use PgBouncer for connection pooling
- **AI SDK singleton**: The ZAI singleton is per-process. Each instance maintains its own connection to the AI provider

---

## 11. Performance Optimizations

### Database Indexes

The Prisma schema defines 30+ indexes strategically placed to optimize the most common query patterns:

| Model | Indexed Fields | Query Pattern Optimized |
|-------|---------------|------------------------|
| User | `email` | Login lookup (unique) |
| Workspace | `subscriptionTier`, `isActive` | Tier-filtered listings, active workspace queries |
| WorkspaceMember | `workspaceId`, `userId`, `role`, `@@unique([workspaceId, userId])` | Membership lookups, role filtering, membership uniqueness |
| Task | `workspaceId`, `status`, `priority`, `assignedToId`, `dueDate` | Task listing by status/priority, assignment lookups, deadline queries |
| FinanceAccount | `workspaceId`, `type` | Account listing, type filtering |
| Transaction | `workspaceId`, `accountId`, `category`, `type`, `date` | Transaction listing, account reconciliation, category reports, date-range queries |
| BudgetRule | `workspaceId`, `category`, `isActive` | Budget lookups, active rule filtering |
| FinancialGoal | `workspaceId`, `priority` | Goal listing, priority sorting |
| VaultDocument | `workspaceId`, `type`, `scope` | Document listing, type/scope filtering |
| Memory | `workspaceId`, `layer`, `importance`, `expiresAt` | Memory retrieval by layer, importance-based ranking, TTL expiry |
| Suggestion | `workspaceId`, `status`, `agentSource` | Suggestion listing, status filtering, agent attribution |
| AgentLog | `workspaceId`, `agentType`, `createdAt` | Log listing, agent filtering, chronological sorting |
| Subscription | `userId`, `status`, `stripeSessionId`, `stripeSubId` | User subscriptions, active status, Stripe webhook correlation |

### Query Optimization Patterns

1. **Parallel Data Loading**: AI endpoints use `Promise.all()` to fetch workspace context (members, tasks, accounts, memories) concurrently rather than sequentially, reducing total latency from the sum of query times to the maximum.

2. **Result Limiting**: All AI context queries apply `take` limits (members: 10, tasks: 20, memories: 10, transactions: 100) to bound response size and prevent excessive token consumption in AI prompts.

3. **Importance-Based Memory Retrieval**: Agent runs only fetch memories with `importance ≥ 7`, filtering out low-value memories before sending to the AI, reducing both database load and AI token consumption.

4. **Pagination**: List endpoints support offset-based pagination (`page`, `limit`) with a maximum limit of 100, preventing unbounded result sets.

5. **Prisma Client Singleton**: The database client is instantiated once globally (per Node.js process) to prevent connection pool exhaustion in development:

```typescript
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],  // Production logs only errors
})
```

### Client-Side Caching

React Query provides multi-level caching on the client:

| Strategy | Implementation | Benefit |
|----------|---------------|---------|
| **Stale-while-revalidate** | Default React Query behavior | Show cached data immediately, refresh in background |
| **Query key partitioning** | `['workspaces']`, `['tasks', wsId, filters]`, etc. | Granular cache invalidation |
| **Mutation invalidation** | `qc.invalidateQueries({ queryKey: [...] })` | Automatic cache refresh after mutations |
| **Conditional fetching** | `enabled: !!workspaceId` | Skip queries when data isn't needed yet |
| **Filter-based caching** | Query keys include filter params | Separate cache entries for different filter states |

### AI Performance

| Optimization | Implementation | Impact |
|-------------|---------------|--------|
| **SDK Singleton** | Single ZAI instance reused across requests | Eliminates initialization overhead |
| **Initialization Deduplication** | Shared promise for concurrent cold starts | Prevents duplicate SDK initialization |
| **Timeout Racing** | `Promise.race()` with 30s timeout | Prevents indefinite hangs |
| **Token Limiting** | `maxTokens: 2048` for agent runs | Controls AI response size and cost |
| **Context Pruning** | `take` limits on all context queries | Reduces prompt token consumption |
| **Input Sanitization** | 5,000 character cap on user input | Prevents oversized prompts |

---

## 12. Monitoring & Observability

### Logging Strategy

The application implements structured logging at multiple levels:

| Layer | Logging | Configuration |
|-------|---------|---------------|
| **Prisma ORM** | Query, error, warning logs | Development: `['query', 'error', 'warn']`, Production: `['error']` |
| **API Routes** | Console error logging | `console.error('[Context]', message)` on all catch blocks |
| **AI Operations** | Error logging with context | `console.error('[AI Chat Error]', message)` |
| **Stripe Webhooks** | Event type logging | `console.log('Unhandled Stripe event type:', event.type)` |
| **Rate Limiting** | Cleanup cycle (5-minute interval) | In-memory store garbage collection |

### Error Tracking

All API route catch blocks follow a consistent error handling pattern:

```typescript
catch (error: unknown) {
  // Zod validation errors → 400
  if (error instanceof Error && error.name === 'ZodError') {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }
  // All other errors → 500 with console logging
  console.error('[Operation] error:', error)
  return NextResponse.json({ error: 'Failed to [operation]' }, { status: 500 })
}
```

### Audit Trail

The `AgentLog` model provides a complete audit trail for all AI autonomous actions:

- **What happened**: `action` field describes the operation
- **What was the result**: `result` field captures the output (truncated to 500 chars)
- **Why it happened**: `reasoning` field captures the rationale
- **Who authorized it**: `autonomousLevel` records the permission boundary at execution time
- **When it happened**: `createdAt` provides the timestamp
- **Which agent**: `agentType` identifies the responsible agent

### Health Check

The root API endpoint (`GET /api`) serves as a health check, returning a simple response indicating the server is operational. This endpoint bypasses authentication in the middleware, making it suitable for load balancer health checks.

### Production Monitoring Recommendations

| Area | Recommendation | Implementation |
|------|---------------|---------------|
| **Application Performance** | APM integration (DataDog, New Relic, or Vercel Analytics) | Wrap API routes with timing middleware |
| **Error Tracking** | Sentry integration | Capture all unhandled errors and Zod validation failures |
| **Database Monitoring** | Prisma Accelerate or PgHero | Query performance analysis, connection pool monitoring |
| **Rate Limiting** | Migrate to Redis-backed rate limiting (`@upstash/ratelimit`) | Required for multi-instance deployments |
| **Uptime Monitoring** | External health check against `GET /api` | Alert on 5xx responses or timeout |
| **Stripe Monitoring** | Stripe Dashboard + webhook endpoint monitoring | Alert on webhook failures |
| **AI Usage** | Token consumption tracking per workspace | Implement daily AI call counter with subscription limits |
| **Memory Expiry** | Cron job for expired memory cleanup | `DELETE FROM Memory WHERE expiresAt < NOW()` |
| **Log Aggregation** | Structured JSON logging + ELK/Datadog | Replace `console.error` with structured logger |

### Key Metrics to Monitor

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| API response time (p95) | APM | > 2 seconds |
| AI endpoint response time (p95) | APM | > 10 seconds |
| Database connection pool usage | Prisma metrics | > 80% |
| Rate limit 429 responses | Access logs | > 1% of traffic |
| Stripe webhook failures | Stripe Dashboard | Any failure |
| Agent log error rate | AgentLog table | > 5% of runs |
| Memory table size | Database metrics | > 100K rows per workspace |
| Subscription churn | Subscription table | Monitor `cancelled` status rate |

---

*This architecture document is maintained alongside the codebase. Last updated for version 4.0.0.*
