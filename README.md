# Famlyzer AI

> **Autonomous AI Decision & Planning Intelligence**
> Life · Family · Team · Finance · Decision Intelligence

Famlyzer AI is an AI-powered SaaS platform that manages **time, money, energy, relationships, and life goals** in one unified system — with AI as the operator, not just an assistant.

## What We Sell

> Access to intelligence, memory, and AI's ability to think & act.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Database** | Prisma ORM (SQLite) |
| **State** | Zustand + React Query |
| **AI** | z-ai-web-dev-sdk |
| **Charts** | Recharts |
| **Animations** | Framer Motion |

## Architecture

### 7 AI Agents

| Agent | Function |
|-------|----------|
| **Planner Agent** | Schedule optimization & task management |
| **Finance Agent** | Cashflow tracking & budget enforcement |
| **Mediator Agent** | Human conflict detection & resolution |
| **Health Agent** | Energy & stress monitoring |
| **Education Agent** | Skill gap analysis & learning paths |
| **Memory Agent** | Consistency checking & pattern recognition |
| **Executive Agent** | Final decision orchestration |

### 4-Level Autonomous System

```
0. Observe     — AI only observes
1. Suggest     — AI provides suggestions
2. Act (Confirm) — AI acts with your confirmation
3. Full Auto   — AI acts fully autonomously
```

### 4-Layer Memory System

1. **Short-term context** — Recent events (24h TTL)
2. **Long-term habits** — Behavioral patterns (90d TTL)
3. **Decision history** — Past decisions and outcomes
4. **Emotional patterns** — Stress/energy trends

### Knowledge Vault

Single source of truth for AI reasoning:
- Rules & policies
- Contracts & documents
- Financial records
- Health data
- **Vault > Memory > Assumption** (AI priority hierarchy)

---

## Getting Started

```bash
# Install dependencies
bun install

# Set up database
bun run db:push

# Start development
bun run dev
```

## Business Model

### 🆓 7-Day Free Trial
- All features active
- All AI agents running
- Full autonomous level
- Unlimited data

### 💳 Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Starter** | Free | 1 workspace, 3 users, Advisory level |
| **Professional** | $19/mo | 5 workspaces, 15 users, Semi-autonomous |
| **Business** | $49/mo | Unlimited, Fully autonomous |

**No free forever. The value of AI must be paid for.**

---

## Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── ai/           # AI agent endpoints
│   │   ├── auth/         # Authentication
│   │   └── workspaces/   # Workspace CRUD
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main SPA page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Dashboard with charts
│   ├── planner.tsx       # Task management
│   ├── finance.tsx       # Budget & accounts
│   ├── vault.tsx         # Knowledge vault
│   ├── ai-assistant.tsx  # AI chat interface
│   ├── settings.tsx      # Configuration
│   ├── onboarding.tsx    # Setup wizard
│   └── app-layout.tsx    # Main layout with sidebar
├── lib/
│   ├── ai.ts             # AI SDK configuration
│   ├── db.ts             # Prisma client
│   ├── hooks.ts          # React Query hooks
│   ├── store.ts          # Zustand state
│   └── utils.ts          # Utilities
└── prisma/
    └── schema.prisma     # Database schema
```

## API Endpoints

| Category | Endpoints |
|----------|-----------|
| Auth | `POST /api/auth/setup`, `GET /api/user` |
| Workspaces | `POST/GET/PATCH /api/workspaces` |
| Members | `POST/GET/PATCH /api/workspaces/[id]/members` |
| Tasks | `POST/GET/PATCH/DELETE /api/workspaces/[id]/tasks` |
| Finance | Accounts, Transactions, Budget Rules, Goals |
| Vault | `POST/GET/PATCH/DELETE /api/workspaces/[id]/vault` |
| Memory | `POST/GET/DELETE /api/workspaces/[id]/memories` |
| AI | Chat, Analyze, Suggest, Optimize, Audit, Agent-Run |
| Suggestions | `GET/PATCH /api/workspaces/[id]/suggestions` |
| Subscriptions | `GET/POST /api/subscriptions` |

## Principles

- **AI is not a gimmick** — It genuinely reduces chaos and increases clarity
- **Data belongs to the user** — Never sold, never trained on
- **Vault > Memory > Assumption** — AI must cite sources
- **Financial safety above comfort** — Emergency fund is sacred
- **Think before acting** — Simulate before deciding

---

*Version: v3.0.0 — Full Next.js 16 SaaS Platform*
*Previous: v2.0.0 — Vite/React with Gemini API*
