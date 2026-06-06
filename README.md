# Famlyzer AI

> Autonomous Decision & Planning Intelligence for Life, Family & Finance

[![Version](https://img.shields.io/badge/version-6.0.0-emerald)](https://github.com/mulkymalikuldhrs/famlyzer-ai)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Overview

Famlyzer AI is a comprehensive SaaS platform that uses 7 autonomous AI agents to provide holistic decision support across life, family, and finance domains. It features a 4-layer memory architecture, knowledge vault with RAG, and multi-level autonomous control.

## Features

- **7 AI Agents** — Planner, Finance, Mediator, Health, Education, Memory, Executive
- **4-Layer Memory** — Short-term, long-term, decision, and emotional memory layers
- **Knowledge Vault** — RAG-powered document intelligence (notes, rules, contracts, PDFs)
- **Autonomous Control** — 4-level autonomous system (Observe → Suggest → Act → Full Auto)
- **Financial Guardian** — AI veto on budget overruns, real-time monitoring, audit reports
- **Multi-Workspace** — Personal, Family, and Company workspaces with role-based access
- **Stripe Payments** — Free, Professional ($19/mo), and Business ($49/mo) tiers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| UI | shadcn/ui, Framer Motion, Recharts, Lucide Icons |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js v4 (JWT + bcrypt) |
| AI | z-ai-web-dev-sdk with multi-agent system |
| Payments | Stripe (checkout, webhooks, subscriptions) |
| State | Zustand + React Query |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Stripe account (for payments)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
   cd famlyzer-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your values — see Environment Variables below
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Session encryption key (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | App URL (e.g., `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | 💰 | Stripe secret key for payments |
| `STRIPE_PUBLISHABLE_KEY` | 💰 | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | 💰 | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | 💰 | Stripe price ID for Pro monthly |
| `STRIPE_PRO_YEARLY_PRICE_ID` | 💰 | Stripe price ID for Pro yearly |
| `STRIPE_BUSINESS_MONTHLY_PRICE_ID` | 💰 | Stripe price ID for Business monthly |
| `STRIPE_BUSINESS_YEARLY_PRICE_ID` | 💰 | Stripe price ID for Business yearly |

> 💰 = Required for payment features. App works without Stripe in free-tier mode.

> ⚠️ **Never commit `.env` to git.** The `.env.example` file is safe to commit.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (auth, AI, workspaces, subscriptions)
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading state
│   ├── not-found.tsx      # 404 page
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main app entry
├── components/
│   ├── error/             # Error boundary component
│   ├── ui/                # shadcn/ui components
│   ├── app-layout.tsx     # Main layout with sidebar
│   ├── dashboard.tsx      # Dashboard with charts & agent status
│   ├── planner.tsx        # Task pipeline & calendar
│   ├── finance.tsx        # Accounts, transactions, budgets, goals
│   ├── vault.tsx          # Knowledge vault with search
│   ├── ai-assistant.tsx   # Multi-agent chat interface
│   ├── settings.tsx       # Workspace, autonomous, subscription config
│   └── onboarding.tsx     # 4-step onboarding wizard
├── lib/
│   ├── ai.ts             # ZAI SDK wrapper with timeout & sanitization
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client singleton
│   ├── hooks.ts          # React Query hooks for all API routes
│   ├── rate-limit.ts     # In-memory rate limiter
│   ├── stripe.ts         # Stripe helpers & pricing config
│   ├── store.ts          # Zustand global state
│   ├── validations.ts    # Zod schemas for all endpoints
│   └── utils.ts          # Utility functions
├── types/
│   └── next-auth.d.ts    # NextAuth type augmentations
└── middleware.ts          # Auth + workspace authorization middleware
```

## API Endpoints

### Auth
- `POST /api/auth/setup` — Register or login
- `GET /api/auth/[...nextauth]` — NextAuth handler

### AI
- `POST /api/ai/chat` — General AI chat
- `POST /api/ai/analyze` — Comprehensive workspace analysis
- `POST /api/ai/suggest` — Generate AI suggestions
- `POST /api/ai/optimize-schedule` — Schedule optimization
- `POST /api/ai/audit-finances` — Financial audit
- `POST /api/ai/agent-run` — Run specific agent

### Workspaces
- `GET/POST /api/workspaces` — List/create workspaces
- `GET/PATCH /api/workspaces/[id]` — Get/update workspace
- `GET/POST /api/workspaces/[id]/members` — List/add members
- `PATCH/DELETE /api/workspaces/[id]/members/[MemberId]` — Update/remove member
- `GET/POST /api/workspaces/[id]/tasks` — List/create tasks
- `PATCH/DELETE /api/workspaces/[id]/tasks/[taskId]` — Update/delete task
- `GET/POST /api/workspaces/[id]/accounts` — List/create finance accounts
- `GET/POST /api/workspaces/[id]/transactions` — List/create transactions
- `GET/POST /api/workspaces/[id]/budget-rules` — List/create budget rules
- `GET/POST /api/workspaces/[id]/financial-goals` — List/create financial goals
- `GET/POST /api/workspaces/[id]/vault` — List/create vault documents
- `PATCH/DELETE /api/workspaces/[id]/vault/[docId]` — Update/delete vault document
- `GET/POST /api/workspaces/[id]/memories` — List/create memories
- `DELETE /api/workspaces/[id]/memories/[MemoryId]` — Delete memory
- `GET /api/workspaces/[id]/suggestions` — List suggestions
- `PATCH /api/workspaces/[id]/suggestions/[suggestionId]` — Update suggestion status
- `GET /api/workspaces/[id]/agent-logs` — List agent logs

### Subscriptions
- `GET/POST /api/subscriptions` — List/create subscriptions
- `POST /api/subscriptions/stripe-webhook` — Stripe webhook handler

## Security

- **Authentication** — NextAuth JWT sessions with bcrypt password hashing
- **Authorization** — Workspace membership + role-based access control
- **Rate Limiting** — Tiered limits per route type (AI: 5-20/min, API: 60/min, Auth: 10/15min)
- **Input Validation** — Zod schemas on all 30+ API endpoints
- **Prompt Injection Defense** — AI input sanitization, system role blocked from client
- **Security Headers** — HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy
- **CSRF Protection** — NextAuth built-in CSRF tokens

## License

MIT © Mulky Malikul Dhaher

## Author

**Mulky Malikul Dhaher**
Email: mulkymalikudhr@mail.com
GitHub: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

---

*For Education Purpose — Trilingual Disclaimer (EN/ID/CN)*
*Untuk Tujuan Pendidikan*
*仅用于教育目的*
