# Changelog

All notable changes to Famlyzer AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.1] - 2026-05-25

### Added — Open Source & Community

- **MIT License** — Project now open source under MIT license
- **Trilingual README** — Full documentation in English, Bahasa Indonesia, and 中文 (Chinese)
- **CONTRIBUTING.md** — Comprehensive contributor guide with trilingual sections
- **Code of Conduct** — Contributor Covenant v2.1 adopted
- **Security Policy** — Responsible disclosure process via security@ email
- **GitHub Issue Templates** — Bug Report, Feature Request, and Translation templates
- **Pull Request Template** — Standardized PR checklist with quality gates
- **FUNDING.yml** — GitHub Sponsors and contact funding links
- **Issue Template Config** — Blank issues disabled, contact links added
- **package.json** — Added author, repository, bugs, homepage, and keywords fields
- **Star History** — Dynamic star history chart in README
- **Animated badges** — Shields.io badges with for-the-badge style throughout README
- **Profile views counter** — Visitor tracking via komarev.com
- **Social links** — GitHub follow and Twitter follow badges in footer
- **Language switcher** — Clickable badges for EN / ID / CN sections

### Changed

- `package.json`: `private` changed from `true` to `false` for open source
- `package.json`: `license` set to `MIT`
- README completely rewritten with trilingual sections and visual enhancements
- CONTRIBUTING.md rewritten with full trilingual support (EN/ID/CN)

---

## [4.0.0] - 2026-05-25

### Added — Security & Authentication

- NextAuth.js v4 integration with JWT session strategy (7-day expiry)
- Credentials-based authentication with email/password
- bcrypt password hashing (12 salt rounds)
- Route protection middleware for all API routes
- Workspace membership authorization with role-based access control (owner / admin / member)
- Role-based access control for admin-level operations
- Rate limiting tiered by route type:
  - AI routes: 5–20 requests/min
  - Standard API routes: 60 requests/min
  - Write operations: 30 requests/min
  - Auth routes: 10 requests per 15 min
- Security headers applied globally:
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (camera, microphone, geography disabled)
- Input sanitization for AI prompts (anti-prompt-injection defenses)
- Client-side chat messages restricted to `user` / `assistant` roles only — system role injection blocked

### Added — Validation

- Zod validation schemas for all 30 API endpoints
- Email format validation
- Password minimum length enforcement (8 characters)
- Numeric bounds on financial amounts, energy/stress levels, and time costs
- Enum validation for all status, type, and priority fields
- Pagination schema with hard cap of 100 items per page

### Added — Payments

- Stripe payment integration with Checkout Sessions
- Three-tier pricing model:
  - **Free** — $0/mo
  - **Professional** — $19/mo or $190/yr
  - **Business** — $49/mo or $490/yr
- Stripe webhook handler for subscription lifecycle events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Stripe customer management linked to workspaces
- Subscription tier enforcement with feature limits per plan

### Added — Database

- Migrated from SQLite to PostgreSQL
- 15 Prisma enums replacing free-text string fields
- 30+ database indexes for query performance optimization
- Foreign key constraints:
  - `Task` → `WorkspaceMember`
  - `Transaction` → `FinanceAccount`
- JSON columns for `constraints`, `preferences`, and `visibility` fields (previously stringified)
- `Decimal` type for all monetary values (previously `Float`)
- `updatedAt` timestamps added to `Memory`, `Suggestion`, and `AgentLog` models
- Stripe-related fields:
  - `stripeCustomerId` on `Workspace`
  - `stripeSessionId` and `stripeSubId` on `Subscription`

### Changed — API Routes

- All 30 API routes now require authentication via `getServerSession()`
- Workspace routes verify membership before granting access
- Task updates: `aiRejected` and `aiRejectionReason` fields can only be set server-side
- Transaction creation now uses Prisma `$transaction()` for atomicity (create transaction + update account balance)
- All list endpoints now support pagination with `page` / `limit` parameters and total count in response
- Members: `DELETE` endpoint added; `owner` role cannot be assigned or removed
- Workspace `PATCH`: owner/admin authorization check; audit log entry created when autonomous level changes to ≥ 2
- Subscriptions: migrated to Stripe checkout flow — free-tier bypass removed
- AI routes: workspace context limited to data minimization principles; prompt injection prevention enforced

### Changed — Frontend

- Onboarding now requires password with show/hide toggle
- Sign in / Create account toggle added to onboarding screen
- `NextAuth signIn()` called after registration to establish session automatically
- `useAuth` hook now accepts `password` parameter
- `useSubscriptions` / `useWorkspaces` no longer require `userId` parameter (auth-derived)
- `useCurrentUser` replaces `useUser(email)`

### Changed — Infrastructure

- `tsconfig.json`: `noImplicitAny` now `true`
- `next.config.ts`: security headers configured; `poweredByHeader` disabled
- Prisma query logging enabled only in development environment
- AI module: 30-second timeout, structured error handling, ZAI singleton with retry logic
- `.env.example`: comprehensive template with PostgreSQL, NextAuth, Stripe, Redis, and S3 variables
- `.gitignore`: `prisma/migrations/` removed from ignore list — migrations now tracked in version control

### Removed

- Unauthenticated API access — all routes now require a valid session
- Free-text string fields replaced by Prisma enums across the schema
- `parseFloat` / `parseInt` calls without bounds checking
- Client-side system role injection in AI chat
- SQLite as a supported database provider

---

## [3.0.0] - 2026-05-25

### Added

- **Complete platform migration** from Vite/React to Next.js 16 with App Router
- **Prisma ORM** with SQLite database schema (12 models: User, Workspace, WorkspaceMember, Task, FinanceAccount, Transaction, BudgetRule, FinancialGoal, VaultDocument, Memory, Suggestion, AgentLog, Subscription)
- **26 REST API endpoints** covering all CRUD operations
- **AI integration** via z-ai-web-dev-sdk (replacing direct Gemini API calls)
- **Dashboard** with cashflow timeline charts, emergency fund meter, stress & energy index bars, 7-agent status grid, autonomous status indicator, AI decision log, and predictions panel
- **Planner** with task pipeline (Pending/Approved/Done), resource cost visualization (time/energy/money), AI schedule optimization, calendar week view, and AI rejection notices
- **Finance** with multi-account support, transaction tracking with category filtering, budget rules with auto-veto warnings, financial goals with progress tracking, and AI financial audit
- **Knowledge Vault** with document management (notes, rules, contracts, PDFs, images, audio), search/filter by type and scope, metadata system with priority/visibility/tags, and AI intelligence indicator
- **AI Assistant** chat interface with 8 agent selection, quick action buttons (Analyze, Suggest, Optimize, Audit), memory layer indicator, and contextual workspace awareness
- **Settings** with workspace configuration, 4-level autonomous system selector, member management with energy/stress tracking, subscription tier display, and 4-layer memory management dashboard
- **Onboarding wizard** with 4-step setup (Welcome, Account, Workspace, Tutorial)
- **Zustand** state management with localStorage persistence
- **React Query** for server state with automatic cache invalidation
- **Responsive design** with collapsible sidebar for mobile
- **shadcn/ui** component library with emerald/teal color theme
- **Framer Motion** animations for page transitions and card entries
- **Sonner** toast notifications for user feedback

### Changed

- Migrated from Vite build system to Next.js 16
- Migrated from direct Google Gemini API to z-ai-web-dev-sdk
- Migrated from in-memory state to persistent SQLite database via Prisma
- Migrated from client-side AI calls to server-side API routes
- Migrated from CSS modules to Tailwind CSS 4 + shadcn/ui
- Replaced JS Puter orchestration with z-ai-web-dev-sdk agent system

### Removed

- Vite build configuration
- Direct Gemini API client (`@google/genai`)
- Client-side Google Drive integration
- Client-side IndexedDB storage
- Firebase integration stub
- Service worker (sw.js)

---

## [2.0.0] - 2026-02-01

### Added

- Full autonomous AI system with Gemini integration
- 7 AI agents: Planner, Finance, Mediator, Health, Education, Memory, Executive
- Agent Coordinator for orchestration
- Autonomous Core with trigger system
- Memory System with 4 layers (short-term, long-term, decision, emotional)
- Suggestion Engine with 4 types (preventive, corrective, strategic, behavioral)
- Vault Intelligence for document-aware AI reasoning
- Subscription Service with trial logic
- Drive Service for Google Drive data persistence
- Event System for agent communication
- Dashboard with autonomous status display
- Planner with AI optimization
- Finance with auto-veto system
- Vault with document management
- AI Assistant chat interface
- Onboarding flow

### Changed

- Replaced JS Puter orchestration with Gemini AI agents
- All 7 agents now Gemini-powered instead of rule-based
- Improved autonomous flow with trigger detection

---

## [1.0.0] - 2026-01-15

### Added

- Initial Famlyzer AI concept and blueprint
- Core product definition and business model
- Workspace & role system (Personal, Family, Company)
- Member schema with authority levels
- Task system with resource allocation (time, energy, money)
- Budget tracker with financial entities
- Knowledge Vault concept
- System prompt for AI behavior
- MVP roadmap (30 days)

---

[4.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v4.0.0
[3.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v3.0.0
[2.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v2.0.0
[1.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v1.0.0
