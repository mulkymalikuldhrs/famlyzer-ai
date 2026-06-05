# Changelog

All notable changes to Famlyzer AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.0.0] - 2026-03-05

### Added — Error Handling & Resilience

- `ErrorBoundary` React component wrapping entire app — shows user-friendly fallback with retry button
- `error.tsx` — Next.js global error boundary with proper error display
- `loading.tsx` — Global loading state with accessible `role="status"`
- `not-found.tsx` — 404 page with navigation back to home
- All error pages include `role="alert"` for screen reader accessibility

### Fixed — Validation & Type Safety

- Replaced all `z.any()` in validation schemas with `z.record(z.unknown()).optional()` for constraints, preferences, visibilityScope, visibility, and metadata fields
- Vault `visibility` and `tags` schemas changed from `z.any()` to `z.array(z.string()).optional()` for proper type inference
- Added `isZodError()` helper function to correctly detect Zod validation errors (previous `error.name === 'ZodError'` check was unreliable across bundlers)
- Fixed all 22 API routes to use `isZodError()` instead of the broken `error instanceof Error && error.name === 'ZodError'` pattern
- Added `NaN` guards on all `parseInt()` calls for pagination parameters (`page`, `limit`) — now uses `Math.max(1, parseInt(...) || defaultValue)` to prevent NaN from crashing queries

### Added — Accessibility

- `aria-label` added to all navigation buttons in sidebar (`Navigate to Dashboard`, etc.)
- `aria-current="page"` on active navigation item
- `role="main"` on main content area
- `aria-label="Open navigation menu"` on mobile hamburger button
- `aria-label="Retry loading the page"` on error boundary retry button
- `aria-label="Return to the home page"` on not-found page button
- All loading states include `role="status"` for screen readers

### Added — SEO & Metadata

- Open Graph metadata (`og:title`, `og:description`, `og:type`, `og:site_name`)
- `authors` metadata field
- `metadataBase` for proper URL resolution
- Extended keywords list with SaaS, Budget, Task Management terms

### Fixed — Infrastructure

- Added `/dist` to `.gitignore` (was missing, could accidentally track build artifacts)
- Error boundary wrapping in root layout prevents white screen of death on unhandled errors

### Changed — Documentation

- README.md completely rewritten with comprehensive documentation:
  - Feature list with badges
  - Full tech stack table
  - Step-by-step setup guide
  - Environment variables table with required/optional indicators
  - Project structure tree
  - Complete API endpoint reference
  - Security features documentation
  - License and trilingual disclaimer

---

## [4.1.0] - 2026-03-05

### Changed
- Updated README with trilingual disclaimer (EN/ID/CN) and "For Education Purpose" notice
- Updated README contributing section to welcome community contributions
- Changed license reference from Proprietary to MIT
- Added contact information (Mulky Malikul Dhaher | mulkymalikuldhaher@email.com)

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
- **Prisma ORM** with SQLite database schema (12 models)
- **26 REST API endpoints** covering all CRUD operations
- **AI integration** via z-ai-web-dev-sdk
- **Dashboard** with cashflow timeline charts, emergency fund meter, stress & energy index bars, 7-agent status grid
- **Planner** with task pipeline, resource cost visualization, AI schedule optimization, calendar week view
- **Finance** with multi-account support, transaction tracking, budget rules with auto-veto warnings, financial goals
- **Knowledge Vault** with document management, search/filter, AI intelligence indicator
- **AI Assistant** chat interface with 8 agent selection, quick action buttons, memory layer indicator
- **Settings** with workspace configuration, 4-level autonomous system, member management, subscription tiers
- **Onboarding wizard** with 4-step setup
- **Zustand** state management with localStorage persistence
- **React Query** for server state with automatic cache invalidation
- **Responsive design** with collapsible sidebar for mobile
- **shadcn/ui** component library with emerald/teal color theme
- **Framer Motion** animations for page transitions and card entries
- **Sonner** toast notifications for user feedback

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

[5.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v5.0.0
[4.1.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v4.1.0
[4.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v4.0.0
[3.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v3.0.0
[2.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v2.0.0
[1.0.0]: https://github.com/mulkymalikuldhrs/famlyzer-ai/releases/tag/v1.0.0
