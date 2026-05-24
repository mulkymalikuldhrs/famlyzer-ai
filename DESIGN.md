# Famlyzer AI — Product Design Document

> **Version 4.0.0** | Autonomous Decision & Planning Intelligence — Life, Family, Team, Finance SaaS Platform

---

## Table of Contents

1. [Product Vision & Philosophy](#1-product-vision--philosophy)
2. [User Personas](#2-user-personas)
3. [Core Design Principles](#3-core-design-principles)
4. [Autonomous System Design](#4-autonomous-system-design)
5. [AI Agent Architecture](#5-ai-agent-architecture)
6. [Memory System Design](#6-memory-system-design)
7. [Knowledge Vault Design](#7-knowledge-vault-design)
8. [Financial Intelligence Design](#8-financial-intelligence-design)
9. [Member & Energy Management](#9-member--energy-management)
10. [Workspace & Subscription Design](#10-workspace--subscription-design)
11. [Security & Privacy Design](#11-security--privacy-design)
12. [User Interface Design](#12-user-interface-design)

---

## 1. Product Vision & Philosophy

Famlyzer AI exists to solve a fundamental problem of modern life: **decision chaos**. Individuals, families, and small teams face an overwhelming volume of daily decisions spanning finances, schedules, health, relationships, and education — each decision rippling into the next, often with no systematic framework for evaluation. The result is cognitive overload, financial leakage, energy depletion, and chronic misalignment between intentions and outcomes.

Our vision is to build an **Autonomous Decision & Planning Intelligence** — not a passive dashboard that reports what happened, but an active operator that thinks ahead, prevents problems before they manifest, and executes decisions within boundaries you define. Famlyzer AI is the difference between a GPS that shows where you are and one that reroutes you before you hit traffic.

The philosophical foundation rests on three pillars. **First, AI as operator, not assistant.** The system does not wait to be asked. It observes continuously, suggests proactively, and — at higher autonomous levels — acts on your behalf within guardrails you control. **Second, intelligence must be earned, not assumed.** Every AI suggestion cites its reasoning, references Vault documents as source of truth, and never fabricates information. The hierarchy is explicit: Vault > Memory > Assumption. If the AI cannot ground a recommendation in known data, it says so. **Third, safety is non-negotiable.** Financial safety, data privacy, and human agency are absolute constraints. The system will never execute a financial action that violates a sacred budget rule, never share data across workspace boundaries, and never escalate its autonomous level without explicit owner consent.

We sell access to intelligence, memory, and AI's ability to think and act. The value proposition is simple: reduce chaos, increase clarity, preserve harmony. Every feature, every agent, every interaction must demonstrably advance at least one of these three outcomes.

---

## 2. User Personas

### Persona 1: The Individual Professional ("Solo Planner")

**Demographics:** Age 25-40, salaried or freelance income, lives alone or with partner, tech-comfortable, manages own finances and schedule.

**Core Pain Points:** Scattered financial tracking across bank apps and spreadsheets, no systematic approach to budget adherence, difficulty prioritizing competing goals (e.g., emergency fund vs. vacation vs. skill investment), energy management is an afterthought until burnout hits, recurring subscriptions silently draining accounts.

**Famlyzer Use Pattern:** Creates a Personal workspace, connects financial accounts, sets budget rules with sacred priorities for rent and emergency fund. The Finance Agent monitors spending patterns and issues auto-veto warnings when categories approach limits. The Planner Agent optimizes weekly schedules around energy levels. The Health Agent tracks stress indicators from task patterns and suggests rest periods. Uses the AI Assistant for ad-hoc decision support: "Can I afford to take this course right now?" The Memory system builds a long-term profile of spending habits and energy rhythms, enabling increasingly personalized suggestions over time.

**Success Metric:** Monthly savings rate increases by 15-25%, no more unexpected overdrafts, feeling of control over time and money.

### Persona 2: The Family Manager ("Household Architect")

**Demographics:** Age 30-50, married or co-parenting, manages household finances for 2-5 people, children's education and health are top priorities, often the "default decision maker" for the family.

**Core Pain Points:** Financial decisions affect multiple people but are made unilaterally, no visibility into each family member's energy/stress levels, children's education costs are complex and long-term, family conflicts arise from misaligned priorities, no unified system for tracking household rules, contracts, and health records.

**Famlyzer Use Pattern:** Creates a Family workspace, invites family members with aliases (Ayah, Ibu, Anak) and authority levels. The Mediator Agent detects scheduling conflicts and financial disagreements before they escalate. The Education Agent maps children's learning trajectories and recommends resource allocation. The Health Agent monitors family-wide wellness patterns. The Knowledge Vault stores family policies, insurance contracts, and medical records as the single source of truth. Uses the Executive Agent for complex multi-factor decisions that affect the whole family: "Should we take this vacation given current savings, work schedules, and the kids' exam period?"

**Success Metric:** Household financial arguments decrease, children's education planning is proactive not reactive, family members report feeling heard and aligned.

### Persona 3: The Team Lead ("Small Team Operator")

**Demographics:** Age 28-45, leads a small team (5-20 people) in a startup or small business, wears multiple hats (operations, finance, people management), budget-constrained, needs clarity on resource allocation.

**Core Pain Points:** Team energy and burnout are invisible until someone quits, budget tracking is manual and reactive, no systematic way to balance workload across team members, decision bottlenecks when the lead is unavailable, institutional knowledge lives in Slack threads and individual brains.

**Famlyzer Use Pattern:** Creates a Company workspace, adds team members with roles and authority levels. The Finance Agent tracks project budgets with auto-veto on overspend. The Planner Agent distributes tasks based on energy levels and skill constraints. The Memory Agent captures institutional decisions and patterns, preventing knowledge loss. The Mediator Agent flags workload imbalances and interpersonal friction points. Uses the Vault for company policies, client contracts, and operational playbooks. The Executive Agent provides strategic recommendations: "Given Q3 revenue projections and team capacity, which project should we prioritize?"

**Success Metric:** Team utilization improves without burnout, budget overruns decrease by 30%+, institutional knowledge survives personnel changes.

---

## 3. Core Design Principles

### Autonomy with Consent

AI agents operate within explicitly defined boundaries. The four-level autonomous system (Observe → Suggest → Act with Confirm → Full Autonomous) ensures that no AI action occurs without the appropriate level of human awareness or approval. Level changes to 2+ are audit-logged. The default level for new workspaces is 1 (Suggest) — the system will only observe and recommend until the owner explicitly grants higher permissions. This is not a limitation; it is trust-building. Users who see the AI make good suggestions will voluntarily grant more autonomy. Users who are uncomfortable retain full control. The system never pressures users to escalate autonomous levels.

### Financial Safety First

Financial data and actions receive the strictest safeguards in the system. Emergency fund accounts are flagged with `isEmergency: true` and the Finance Agent treats them as sacred — never suggesting withdrawals for non-essential expenses. Budget rules with `sacred` priority trigger automatic veto when exceeded, regardless of autonomous level. Financial transactions are immutable once created; corrections are made through offsetting entries, maintaining a complete audit trail. All monetary calculations use `Decimal(14,2)` precision to prevent floating-point errors. The system would rather miss an opportunity than authorize a dangerous financial action.

### Systematic Thinking Over Reactive Responses

Every AI decision follows a structured reasoning process: gather context → identify constraints → evaluate options → simulate consequences → recommend or act. The system does not respond to the loudest signal or the most recent data point. It considers short-term impact, long-term patterns, and second-order effects. The Memory system ensures that recommendations are informed by historical context, not just current state. The Vault provides the factual foundation. The simulation step — "Simulate before deciding" — is a non-negotiable part of the decision pipeline for any action at autonomous level 2 or above.

### Source of Truth Hierarchy: Vault > Memory > Assumption

When the AI needs information, it follows a strict hierarchy. The Knowledge Vault is the authoritative source — documents, rules, contracts, and records stored there override all other signals. If a Vault document says the monthly rent is $2,400, the AI uses $2,400 regardless of what transaction history suggests. Memory is the second tier — behavioral patterns, past decisions, and learned preferences that the AI has accumulated over time. Memory is valuable but fallible; it decays over time and can be overridden by new Vault entries. Assumption is the lowest tier — the AI's general knowledge about the world, used only when no Vault or Memory data exists. Every suggestion must disclose its source tier: "Based on your Vault policy 'Monthly Budget 2025'..." or "Based on your spending pattern over the last 90 days..." or "Based on general financial planning principles (no workspace data available)..."

### Progressive Disclosure

The interface reveals complexity gradually. New users see a calm dashboard with summary metrics and gentle suggestions. As they engage deeper — adding accounts, creating tasks, adjusting autonomous levels — the system reveals more sophisticated controls and insights. This is not hiding features; it is respecting cognitive load. A user who has only set up a workspace and one account should not be confronted with emotional trend analysis or decision audit logs. They should see their balance, a welcome suggestion, and a clear path to the next step.

### Explain Every Decision

Every AI action, whether a suggestion or an autonomous execution, must be accompanied by a human-readable explanation. The `reasoning` field on AgentLog and the `reason` field on Suggestion are mandatory — no AI action occurs without documented reasoning. Users can always ask "why?" and receive a coherent answer referencing specific data points, rules, or patterns. This is both an ethical requirement and a practical one: users who understand why the AI made a recommendation are far more likely to trust and follow it.

---

## 4. Autonomous System Design

### Four Autonomous Levels

The autonomous system is the core differentiator of Famlyzer AI. It defines the permission boundary within which AI agents operate, ensuring that the system's power is always matched to the user's comfort level.

| Level | Name | Behavior | AI Can Do | AI Cannot Do |
|-------|------|----------|-----------|--------------|
| **0** | Observe | Passive monitoring only | Read all workspace data, detect patterns, log observations to AgentLog | Generate suggestions, create/modify any data, interact with user |
| **1** | Suggest | Advisory mode (default) | Everything in Level 0 + generate Suggestions, provide chat responses, flag risks, recommend actions | Execute any data mutation, create tasks, modify transactions, override user decisions |
| **2** | Act with Confirm | Semi-autonomous | Everything in Level 1 + prepare data changes (staged), create pending tasks/transactions, auto-veto sacred budget violations | Finalize changes without user confirmation, modify existing approved data, change autonomous level, manage members |
| **3** | Full Autonomous | Autonomous within safety bounds | Everything in Level 2 + execute approved actions, auto-rebalance budgets, reschedule tasks within constraints, generate and accept routine suggestions | Override sacred rules, access emergency funds for non-essentials, change autonomous level, remove members, delete workspace data |

### Level Escalation Rules

- **New workspaces** start at Level 1 (Suggest) — never Level 0 (useless) or Level 2+ (unsafe without context)
- **Level escalation** requires Owner action via the Settings page with explicit confirmation dialog
- **Level 2+ changes** are audit-logged with timestamp, user ID, previous level, and new level
- **Level de-escalation** can be performed by Owner or Admin at any time, also audit-logged
- **Free tier** workspaces are capped at Level 1 maximum — semi-autonomous and fully autonomous are premium features
- **Emergency de-escalation**: If the system detects a pattern of harmful autonomous actions (e.g., repeated budget violations at Level 3), it auto-de-escalates to Level 1 and notifies the Owner

### Agent Coordination Protocol

When the user triggers "Run Autonomous Analysis" or the system performs a scheduled analysis, all seven agents execute in a coordinated sequence:

```
1. Memory Agent    → Gather and organize all 4 memory layers, surface relevant context
2. Planner Agent   → Analyze tasks, schedules, dependencies; identify conflicts
3. Finance Agent   → Audit budgets, detect overspend, check goal progress
4. Health Agent    → Assess member energy/stress levels, flag burnout risks
5. Education Agent → Review learning goals, identify skill gaps, check deadlines
6. Mediator Agent  → Detect interpersonal conflicts, schedule clashes, priority disputes
7. Executive Agent → Synthesize all findings, resolve contradictions, produce final recommendations
```

The Executive Agent runs last because it requires the outputs of all other agents. It resolves contradictions (e.g., Planner says "schedule more tasks" but Health says "team is burned out") by applying the principle hierarchy: financial safety > health preservation > schedule optimization > comfort. The Executive's synthesis is what appears as the top-level analysis on the Dashboard.

### Suggestion Lifecycle

Suggestions are the primary output mechanism for Levels 1 and 2. Each suggestion follows a tracked lifecycle:

```
┌──────────┐     User accepts      ┌──────────┐
│          │ ─────────────────────→ │ Accepted │ → Action executed (or staged for L2)
│          │                        └──────────┘
│ Pending  │     User simulates     ┌──────────┐
│          │ ─────────────────────→ │Simulated │ → Consequences shown, reverts to Pending
│          │                        └──────────┘
│          │     User ignores       ┌──────────┐
│          │ ─────────────────────→ │ Ignored  │ → Dismissed, logged for learning
└──────────┘                        └──────────┘
```

- **Pending**: Default state. AI has generated a recommendation with title, reason, predicted consequence, and structured `actionData`.
- **Accepted**: User approves. At Level 1, the user manually executes the suggested action. At Level 2+, the system executes it automatically.
- **Simulated**: User wants to see consequences without committing. The AI projects the outcome using current workspace data without mutating anything. After simulation, the suggestion reverts to Pending for final decision.
- **Ignored**: User dismisses. The Memory Agent records this as a preference signal — "User ignored a budget optimization suggestion" — which influences future suggestion relevance scoring.

Every suggestion carries `agentSource` (which agent generated it), `type` (preventive, corrective, strategic, behavioral), and `actionData` (a JSON payload describing the concrete action to take). This structure enables traceability, audit, and automated execution at higher autonomous levels.

---

## 5. AI Agent Architecture

### Agent Overview

Famlyzer AI deploys seven specialized agents, each responsible for a distinct domain of intelligence. All agents share the same underlying AI provider (z-ai-web-dev-sdk) but receive domain-specific system prompts, workspace context, and memory layer access. The agent architecture is not a set of independent chatbots — it is a coordinated intelligence system where each agent contributes its domain expertise to a unified decision pipeline.

Every agent run follows the same execution pattern: (1) fetch workspace context from the database via Prisma, (2) retrieve relevant memories by layer and importance, (3) construct a structured prompt with the global system prompt plus agent-specific instructions, (4) invoke the AI via `aiChat()` with a 30-second timeout, (5) parse the response, (6) persist an AgentLog entry with action, result, and reasoning, (7) create Memory entries for important findings, and (8) generate Suggestions when applicable.

### Agent 1: Planner Agent

**Domain:** Time, schedules, tasks, and resource allocation across the three cost dimensions (time, energy, money).

**Responsibilities:**
- Analyze task pipelines for bottlenecks, dependencies, and deadline conflicts
- Optimize task assignment based on member energy levels, authority levels, and skill constraints
- Detect overcommitment patterns — when total scheduled time + energy cost exceeds realistic capacity
- Recommend task reordering, delegation, or elimination
- Flag tasks where `aiRejected: true` should be set due to constraint violations

**Trigger Events:** Task created, task status changed, schedule optimization requested, periodic analysis run, member energy level changed significantly.

**Typical Actions:** Generate scheduling suggestions ("Move Task X to Thursday — assigned member has 85% energy today vs. 30% on Monday"), flag overcommitment ("3 critical tasks due Friday but only 4 hours of available high-energy time"), reject infeasible tasks ("This task requires 120 minutes but the assigned member has only 60 minutes available this week").

**Context Inputs:** Tasks with status/priority/costs, member energy levels and constraints, dependency chains, due dates, Vault policies on scheduling.

**Memory Pattern:** Writes to short_term (recent schedule changes), reads from long_term (historical productivity patterns) and emotional (energy trend data).

### Agent 2: Finance Agent

**Domain:** Budgets, transactions, accounts, financial goals, and spending patterns.

**Responsibilities:**
- Monitor budget rule compliance in real-time
- Execute auto-veto on sacred budget violations regardless of autonomous level
- Track financial goal progress and recommend acceleration or reallocation
- Detect anomalous spending patterns (sudden spikes, recurring leaks, subscription creep)
- Validate financial feasibility of planned expenses before they occur
- Protect emergency fund accounts — never suggest non-essential withdrawals

**Trigger Events:** Transaction created, budget rule approached/exceeded, financial goal deadline approaching, periodic financial audit, large expense detected.

**Typical Actions:** Auto-veto warnings ("Food budget is at 95% with 12 days remaining — blocking further category spending"), savings suggestions ("Redirect $50/month from entertainment to emergency fund — you're $3,200 short of your 6-month target"), anomaly alerts ("Transport spending is 40% higher than your 90-day average").

**Context Inputs:** Finance accounts with balances, transactions by category and period, budget rules with priority levels, financial goals with progress, Vault financial policies.

**Memory Pattern:** Writes to short_term (recent transactions), long_term (spending patterns), and decision (financial decisions made). Reads from all layers. The Finance Agent is the heaviest consumer of Memory data.

**Special Behavior — Auto-Veto:** When a budget rule with `sacred` priority is exceeded, the Finance Agent can block further spending in that category regardless of the workspace's autonomous level. This is the only override mechanism that operates at Level 0. The veto generates a Suggestion with `type: corrective` and a visible alert on the Finance page. The Owner can override the veto, but the override is audit-logged.

### Agent 3: Mediator Agent

**Domain:** Interpersonal dynamics, conflict resolution, schedule coordination, and priority alignment.

**Responsibilities:**
- Detect scheduling conflicts between members (double-booked time, competing deadlines)
- Identify priority disputes (two members need the same resource or time slot)
- Flag communication gaps (decisions affecting members who weren't consulted)
- Recommend compromise solutions that balance authority levels and preferences
- Track relationship patterns over time for early warning signs

**Trigger Events:** Task assigned to multiple members, schedule conflict detected, member preference/constraint updated, periodic mediation analysis, new member added.

**Typical Actions:** Conflict alerts ("Ibu has a health appointment and Anak has an exam on the same morning — consider rescheduling one"), compromise suggestions ("Split the budget surplus: 60% to emergency fund (Ayah's priority) and 40% to education fund (Ibu's priority)"), visibility warnings ("This financial decision affects Anak but they have no visibility into the finance tab").

**Context Inputs:** Member aliases, authority levels, constraints, preferences, visibility scopes, task assignments, Vault family/company policies.

**Memory Pattern:** Writes to emotional (interpersonal tension indicators), reads from long_term (historical conflict patterns) and decision (how past conflicts were resolved).

### Agent 4: Health Agent

**Domain:** Member wellness, energy management, stress monitoring, and burnout prevention.

**Responsibilities:**
- Monitor energy levels and stress levels across all workspace members
- Detect burnout patterns (sustained high stress + declining energy + increasing task load)
- Recommend rest periods, task delegation, or schedule adjustments
- Track wellness trends over time and correlate with task/financial patterns
- Enforce minimum rest constraints when defined in member preferences

**Trigger Events:** Member energy level drops below 40%, stress level rises above 70, task assigned to high-stress member, periodic health check, task pipeline exceeds realistic capacity.

**Typical Actions:** Burnout warnings ("Anak's energy has dropped from 75% to 35% over 2 weeks with 4 pending critical tasks — recommend delegating 2 tasks"), rest recommendations ("Schedule a recovery day for Ibu — she's had 12 consecutive high-energy-cost tasks"), correlation insights ("Your spending on entertainment increases by 20% during high-stress weeks — this may indicate stress-spending").

**Context Inputs:** Member energy/stress levels, task energy costs and assignments, Vault health policies, member constraints.

**Memory Pattern:** Writes to emotional (stress/energy trend data) and short_term (recent wellness events), reads from emotional (long-term trends) and long_term (seasonal patterns).

### Agent 5: Education Agent

**Domain:** Learning goals, skill development, knowledge gaps, and educational resource planning.

**Responsibilities:**
- Track education-related tasks and financial commitments
- Identify skill gaps based on current tasks and future goals
- Recommend learning resources and time allocation
- Monitor education budget vs. spending
- Align educational investments with career or family development goals stored in Vault

**Trigger Events:** Education transaction recorded, education goal deadline approaching, skill gap detected in task assignments, periodic education review, new Vault document with education policy.

**Typical Actions:** Skill gap analysis ("Your team has no one proficient in data analysis, but 3 upcoming projects require it — consider a training investment"), budget optimization ("The online course subscription costs $49/month but was used only twice in 90 days — consider switching to per-course pricing"), deadline warnings ("The certification exam registration closes in 5 days and the preparation is only 60% complete").

**Context Inputs:** Education-related transactions, tasks with education tags, Vault education policies and records, member skills/preferences.

**Memory Pattern:** Writes to long_term (learning progress patterns), reads from short_term (recent education activities) and decision (past education investment decisions).

### Agent 6: Memory Agent

**Domain:** Memory lifecycle management, consistency checking, pattern recognition, and context retrieval.

**Responsibilities:**
- Manage the four-layer memory system: creation, retrieval, decay, and expiration
- Detect contradictions between memories and Vault documents (Vault always wins)
- Identify behavioral patterns from historical data across all domains
- Prioritize memory retrieval for other agents based on relevance and importance scores
- Clean up expired short-term memories and consolidate long-term patterns
- Surface relevant context proactively during agent runs

**Trigger Events:** Memory creation requested by any agent, memory expiration cleanup, contradiction detected, periodic consistency check, agent run preparation (context gathering).

**Typical Actions:** Contradiction alerts ("Your Vault policy says rent is $2,400 but your transaction history shows $2,600 — which is correct?"), pattern recognition ("You consistently overspend on food in the last week of each month — set a mid-month checkpoint?"), context surfacing ("Before the Finance Agent runs: here are the 5 most relevant financial decisions from the past quarter").

**Context Inputs:** All memory layers, Vault documents (for consistency checks), all workspace data (for pattern detection).

**Memory Pattern:** The Memory Agent is the only agent that writes to all four layers and reads from all four layers. It manages the memory lifecycle for the entire system. Other agents write to specific layers; the Memory Agent ensures consistency, handles expiration, and optimizes retrieval.

### Agent 7: Executive Agent

**Domain:** Cross-domain synthesis, contradiction resolution, and final decision orchestration.

**Responsibilities:**
- Synthesize outputs from all other agents into coherent recommendations
- Resolve contradictions between agent outputs using the principle hierarchy
- Make final autonomous decisions at Level 3 when agents disagree
- Provide the unified "analysis summary" that appears on the Dashboard
- Escalate truly ambiguous decisions to the user rather than guessing

**Trigger Events:** Full analysis run complete (all other agents have finished), contradiction detected between agent outputs, Level 3 autonomous decision required, user requests executive summary.

**Typical Actions:** Synthesis ("The Planner wants to schedule more tasks, but Health flags burnout risk for 2 members. Resolution: schedule only high-priority tasks for flagged members, delegate the rest."), escalation ("The Finance Agent and Education Agent disagree on budget allocation. This requires your input — both arguments are strong."), priority clarification ("Your Vault policy 'Family First' conflicts with the current work schedule. Which takes precedence this week?").

**Context Inputs:** All agent logs from the current analysis run, all memory layers, Vault priority policies, workspace autonomous level.

**Memory Pattern:** Writes to decision (all executive decisions are permanently recorded), reads from all layers. The Executive Agent's decision memories form the most important audit trail in the system.

**Principle Hierarchy for Contradiction Resolution:**
1. Financial safety (sacred budgets, emergency funds) — always wins
2. Health preservation (burnout prevention, stress management) — wins over schedule
3. Schedule integrity (deadline commitments, dependency chains) — wins over comfort
4. Preference alignment (member preferences, comfort) — wins over optimization
5. Optimization (efficiency, cost savings) — lowest priority, never overrides safety

---

## 6. Memory System Design

### Architecture Overview

The Memory system is what transforms Famlyzer AI from a stateless chatbot into an intelligence platform with persistent contextual awareness. Without memory, every AI interaction starts from zero — the system cannot learn, adapt, or improve its recommendations over time. With memory, the system builds an increasingly accurate model of the workspace's patterns, preferences, and decision history.

The memory system is organized into four distinct layers, each with a different purpose, time horizon, retention policy, and access pattern. This separation is intentional: conflating short-term context with permanent decision records would either overwhelm retrieval with noise or lose critical historical data through premature expiration.

### Layer 1: Short-Term Memory

**Purpose:** Capture recent context, transient interactions, and current-session state that provides immediate situational awareness.

| Property | Value |
|----------|-------|
| **TTL** | 24 hours |
| **Max Entries** | 100 per workspace |
| **Importance Range** | 1-5 (default: 3) |
| **Typical Content** | Recent chat messages, current analysis results, this-week transaction summaries, today's task completions |
| **Eviction Policy** | Time-based expiration via `expiresAt` field; oldest entries expire first |
| **Database Index** | `layer`, `expiresAt` — enables efficient cleanup queries |

**Access Pattern:** Written frequently (every AI interaction, every agent run), read for immediate context. The short-term layer is the "working memory" of the system — it holds what happened today and yesterday so the AI doesn't ask you the same question twice.

**Example Entries:**
- "User asked about vacation budget feasibility — response: not recommended with current savings rate"
- "Planner Agent detected 3 tasks due tomorrow with no assigned members"
- "Finance Agent noted: food spending at 80% of monthly budget with 15 days remaining"

### Layer 2: Long-Term Memory

**Purpose:** Store behavioral patterns, learned preferences, and recurring themes that persist across sessions and inform strategic recommendations.

| Property | Value |
|----------|-------|
| **TTL** | 90 days |
| **Max Entries** | 1,000 per workspace |
| **Importance Range** | 3-8 (default: 5) |
| **Typical Content** | Monthly spending patterns, seasonal energy fluctuations, recurring decision patterns, preference signals from accepted/ignored suggestions |
| **Eviction Policy** | Time-based expiration with importance-weighted retention; entries with importance ≥ 7 get a TTL extension to 180 days |
| **Database Index** | `layer`, `importance` — enables importance-prioritized retrieval |

**Access Pattern:** Written during periodic analyses and significant events, read during every agent run for pattern-informed reasoning. The long-term layer is where the system "learns" — it captures that you always overspend on food in December, or that your energy peaks on Tuesday mornings.

**Example Entries:**
- "Pattern: Food spending increases 25% in the last week of each month (observed over 6 months)"
- "Preference: User consistently ignores entertainment budget suggestions — deprioritize this category"
- "Behavioral: Family schedules are most stable when planned on Sunday evenings"

### Layer 3: Decision Memory

**Purpose:** Maintain a permanent, immutable audit trail of all significant decisions — both user-made and AI-made — for accountability, learning, and compliance.

| Property | Value |
|----------|-------|
| **TTL** | Permanent (no expiration) |
| **Max Entries** | 500 per workspace |
| **Importance Range** | 7-10 (default: 8) |
| **Typical Content** | Accepted suggestions with reasoning, autonomous actions taken, budget overrides, autonomous level changes, policy decisions stored in Vault |
| **Eviction Policy** | None — decision memories are permanent. When the 500-entry limit is reached, the oldest entries are archived (not deleted) to cold storage |
| **Database Index** | `layer`, `importance` — highest importance always retrieved first |

**Access Pattern:** Written when decisions are finalized, read when the AI needs to understand why past choices were made. Decision memory is the "institutional knowledge" of the workspace. It prevents the system from re-recommending a strategy that was already tried and rejected, and it enables users to audit any autonomous action.

**Example Entries:**
- "Decision: Accepted Finance Agent suggestion to increase emergency fund contribution from $200 to $350/month. Reason: 6-month coverage gap identified. Consequence: Entertainment budget reduced by $150."
- "Decision: Auto-de-escalated workspace from Level 3 to Level 1. Reason: 3 consecutive sacred budget violations detected. Triggered by: Finance Agent."

### Layer 4: Emotional Memory

**Purpose:** Track emotional and wellness trends — stress levels, energy patterns, interpersonal dynamics — that inform the Health and Mediator agents.

| Property | Value |
|----------|-------|
| **TTL** | 30 days (shorter than long-term because emotional states are transient) |
| **Max Entries** | 200 per workspace |
| **Importance Range** | 1-8 (default: 5) |
| **Typical Content** | Stress trend alerts, energy dip patterns, interpersonal tension indicators, burnout risk signals, correlation between stress and spending |
| **Eviction Policy** | Time-based expiration. When stress/energy data is updated for a member, the previous entry is not deleted but becomes historical context |
| **Database Index** | `layer`, `importance` — enables rapid retrieval of current wellness state |

**Access Pattern:** Written when member energy/stress levels change, when the Health Agent runs, or when interpersonal patterns are detected. Read primarily by the Health Agent and Mediator Agent for context-aware recommendations.

**Example Entries:**
- "Energy trend: Member 'Ayah' energy dropped from 80% to 45% over 10 days. Correlates with 4 critical tasks assigned in same period."
- "Stress signal: Member 'Ibu' stress level spiked to 85% after 'school fees' transaction — Mediator Agent flagged for discussion"
- "Pattern: Team stress increases uniformly on Mondays — consider reducing Monday meeting load"

### Memory Retrieval Strategy

When an agent run is initiated, the Memory Agent retrieves context in a prioritized, token-efficient manner:

1. **Decision memories** (top 10 by importance, permanent) — ensures the agent knows past commitments
2. **Vault documents** (matched by agent domain and tags) — source of truth overrides
3. **Long-term memories** (top 20 by importance within agent's category) — behavioral patterns
4. **Emotional memories** (top 5, last 7 days) — current wellness context
5. **Short-term memories** (top 10, last 24 hours) — immediate context

This retrieval strategy ensures that the AI prompt contains the most relevant context within token limits, with permanent decisions and Vault data always taking precedence over transient observations.

---

## 7. Knowledge Vault Design

### Purpose & Philosophy

The Knowledge Vault is the single source of truth for AI reasoning. It stores structured, curated documents that the AI references before making any recommendation or taking any action. The Vault exists because AI memory alone is insufficient — memories decay, can be contradictory, and lack the authoritative weight of explicitly authored documents. When the AI needs to know the household's rent amount, the company's expense approval policy, or the family's education savings target, it should not rely on pattern recognition from transactions. It should read the Vault.

The priority hierarchy is absolute: **Vault > Memory > Assumption**. If a Vault document contradicts a Memory entry, the Vault wins and the Memory Agent flags the contradiction for review. If no Vault or Memory data exists, the AI may use general knowledge but must disclose this: "Based on general principles (no workspace data available)."

### Document Types

The Vault supports six document types, each serving a distinct purpose in the AI's reasoning pipeline:

| Type | Purpose | Typical Content | AI Usage |
|------|---------|-----------------|----------|
| **note** | Free-form knowledge capture | Meeting notes, decision rationales, observations | General context for all agents |
| **pdf** | Formal document storage | Tax returns, bank statements, insurance policies | Referenced by Finance Agent for verification |
| **image** | Visual records | Receipts, medical reports, infographics | OCR-extracted text used as context |
| **audio** | Voice transcripts | Meeting recordings, verbal agreements, dictated notes | Transcribed text used as context |
| **contract** | Legal and binding documents | Lease agreements, employment contracts, vendor terms | Referenced by Finance and Mediator Agents for obligation tracking |
| **rule** | Explicit policies and constraints | "Emergency fund must equal 6 months of expenses", "No discretionary spending over $100 without discussion", "Kids' screen time limited to 2 hours on school nights" | Treated as hard constraints by all agents — rules override suggestions |

### Scope & Visibility

Vault documents are scoped at three levels, controlling which members can see and which agents can reference them:

| Scope | Visibility | Use Case |
|-------|-----------|----------|
| **workspace** | All workspace members | Shared policies, joint financial records, family rules, company-wide contracts |
| **family** | Members with family-level visibility scope | Personal medical records, individual education plans, private financial notes |
| **personal** | Only the creating member + Owner | Individual therapy notes, personal goals, private reflections |

The `visibility` JSON field on each VaultDocument provides fine-grained access control beyond scope. It contains an array of member aliases who have access: `["Ayah", "Ibu"]` means only those two members (and the Owner) can see the document. When the AI retrieves Vault context for a member's agent run, it filters documents by scope and visibility to ensure no member receives recommendations based on documents they cannot see.

### Priority System

Vault documents have a three-tier priority system that influences retrieval order and agent behavior:

- **high**: Critical policies, legal contracts, sacred rules. Always retrieved first. Rule-type documents with high priority are treated as hard constraints — the AI will never suggest actions that violate them.
- **medium**: Standard reference documents. Retrieved when relevant to the current domain. Default priority.
- **low**: Supplementary context, historical reference. Retrieved only when no higher-priority documents cover the topic.

### AI Intelligence Layer

The Vault is not a passive file storage system — it is an active intelligence layer that the AI queries and updates:

**Reading:** Before any agent run, the system retrieves relevant Vault documents based on the agent's domain, document tags, and scope. Documents are injected into the AI prompt as structured context with clear delineation: `[VAULT: High Priority Rule] Emergency fund must equal 6 months of expenses.`

**Writing:** Agents can suggest new Vault documents when they detect patterns that should be formalized. For example, the Finance Agent might suggest: "You've manually approved the same budget reallocation 3 times — consider creating a Vault rule to automate this." The suggestion creates a draft `rule` document; it does not auto-insert into the Vault.

**Consistency Checking:** The Memory Agent periodically cross-references Vault documents against Memory entries and current workspace data. Contradictions generate clarification prompts: "Your Vault says the rent is $2,400, but the last 3 transactions show $2,600. Would you like to update the Vault?"

**Tag-Based Retrieval:** Each document carries a `tags` JSON array that enables domain-specific retrieval. A document tagged `["finance", "housing"]` is retrieved when the Finance Agent runs but not when the Education Agent runs. Tags are user-editable and auto-suggested based on content analysis.

---

## 8. Financial Intelligence Design

### Architecture Overview

Financial intelligence is the most safety-critical domain in Famlyzer AI. Every design decision in this section prioritizes accuracy, auditability, and protection over convenience or optimization. The financial system is not designed to maximize returns or minimize effort — it is designed to prevent financial harm, enforce user-defined boundaries, and provide clarity in the face of complexity.

The financial system comprises four interconnected components: Finance Accounts (balance tracking), Transactions (immutable ledger), Budget Rules (spending limits with priority enforcement), and Financial Goals (savings targets with progress tracking). All monetary values use `Decimal(14,2)` precision to prevent floating-point errors common in JavaScript. No financial data is ever estimated or rounded — every calculation uses the exact stored values.

### Multi-Account System

Workspaces can manage multiple financial accounts, each representing a distinct pool of money:

| Account Type | Purpose | Special Behavior |
|-------------|---------|------------------|
| **checking** | Primary transaction account | Default account for new transactions |
| **savings** | Reserved funds | Finance Agent avoids suggesting transfers out unless goal-driven |
| **investment** | Growth-oriented funds | Not included in liquid balance calculations; tracked separately |
| **cash** | Physical cash tracking | Manual entry, no auto-linking |
| **credit** | Credit lines and cards | Balance represents owed amount; Finance Agent monitors utilization |

The `isEmergency` flag is the most important field on any account. When `true`, the Finance Agent treats the account balance as untouchable for non-essential spending. No suggestion at any autonomous level will propose transferring money out of an emergency account for discretionary expenses. This is a hard constraint, not a soft preference.

Accounts support multiple currencies via the 3-character ISO 4217 `currency` field. All cross-currency calculations display a warning about exchange rate assumptions. For simplicity, the current version assumes a single primary currency per workspace; multi-currency conversion is a planned enhancement.

### Budget Rules & Auto-Veto

Budget rules are the enforcement mechanism that gives the Finance Agent its protective power. Each rule defines a spending limit for a category within a time period, with a priority level that determines enforcement strictness:

| Priority | Enforcement | Example |
|----------|------------|---------|
| **sacred** | Hard block — auto-veto triggers regardless of autonomous level. Only Owner can override. | Rent/mortgage, emergency fund contributions, essential healthcare |
| **high** | Strong warning — auto-veto at Level 2+, persistent alerts at Level 1 | Groceries, utilities, insurance |
| **medium** | Standard alert — warning when approaching limit, suggestion to adjust | Entertainment, dining out, subscriptions |
| **low** | Informational — logged but no enforcement action | Hobbies, gifts, miscellaneous |

**Auto-Veto Mechanism:** When a transaction or suggested action would cause spending in a category to exceed its budget rule, the Finance Agent initiates the veto sequence:

1. **Detect**: Calculate current period spending for the category
2. **Compare**: Check against the budget rule's `limitAmount` adjusted for period progress
3. **Veto**: If exceeded and priority is `sacred`, block the action immediately and create a `Suggestion` with `type: corrective`
4. **Alert**: Display the veto warning prominently on the Finance page with the red alert banner
5. **Log**: Record the veto in AgentLog with the specific numbers (current spending vs. limit)
6. **Override**: Owner can override a veto through explicit confirmation; the override is audit-logged in Decision Memory

### Financial Goals

Financial goals track progress toward savings targets with deadline awareness and priority-driven allocation recommendations:

```
Goal: Emergency Fund 6-Month Coverage
Target: $18,000  |  Current: $10,500  |  Progress: 58%
Deadline: December 2025  |  Priority: Critical
Monthly Gap: $1,125/month needed to meet deadline
```

The Finance Agent uses goals to generate allocation recommendations. When the system identifies surplus funds (income exceeds budgeted expenses), it recommends distribution based on goal priority and deadline urgency. Critical goals with approaching deadlines receive allocation priority over low-priority goals with distant deadlines.

Goal progress is tracked via the `currentAmount` field, updated when users allocate funds or when transactions are categorized toward a goal. The AI can also simulate goal trajectories: "At your current savings rate of $400/month, you will reach your emergency fund goal in March 2026 — 3 months after your December 2025 deadline. Options: increase savings by $125/month, extend deadline, or reduce target."

### Transaction Integrity

Transactions are the immutable ledger of all financial activity. Key design decisions:

- **Immutability**: Transactions are never deleted or modified. Corrections are made through offsetting entries (a new transaction with the inverse amount and a reference to the original).
- **Precision**: All amounts use `Decimal(14,2)` — supporting balances up to $999,999,999,999.99 with cent-level precision.
- **Categorization**: 10 predefined categories (food, transport, housing, health, education, entertainment, salary, investment_return, transfer, other) ensure consistent budget rule matching.
- **Recurring tracking**: The `isRecurring` flag identifies subscription and recurring expenses, enabling the Finance Agent to detect subscription creep and predict future obligations.
- **Account linkage**: Transactions optionally link to Finance accounts via `accountId` with `SetNull` on delete — if an account is removed, the transaction remains but loses its account association.

---

## 9. Member & Energy Management

### Member Model

Workspace members are the human agents in the system — the people whose time, energy, and decisions the AI supports. Each member is represented by a `WorkspaceMember` record that links a User to a Workspace with rich metadata:

- **Identity**: `alias` (e.g., "Ayah", "Ibu", "Manager Chen") for human-readable references in AI suggestions and mediator outputs
- **Authority**: `authorityLevel` (1-5) determines decision weight in conflict resolution — a level-5 member's preference overrides a level-1 member's preference when they conflict
- **Wellness**: `energyLevel` (0-100) and `stressLevel` (0-100) provide real-time wellness signals that drive Health Agent recommendations and Planner Agent task assignments
- **Constraints**: JSON object encoding hard limits — "No tasks on Sundays", "Maximum 4 hours of meetings per day", "Medical restriction: no tasks requiring physical exertion"
- **Preferences**: JSON object encoding soft preferences — "Prefers morning tasks", "Likes to review financial decisions on Saturdays", "Prefers shorter task durations"
- **Visibility**: JSON object controlling data access scope — which Vault documents, financial accounts, and memories this member can see

### Energy & Stress Tracking

Energy and stress levels are the most important real-time signals in the system. They directly influence task assignment, scheduling, and health recommendations:

**Energy Level (0-100):**
- **80-100**: Peak capacity — assign critical and high-energy-cost tasks
- **60-79**: Normal — standard task assignment
- **40-59**: Reduced — assign only low-energy-cost tasks; flag for rest
- **20-39**: Low — delegate all non-essential tasks; recommend recovery activities
- **0-19**: Critical — alert workspace owner; block new task assignments; suggest immediate rest

**Stress Level (0-100):**
- **0-30**: Normal — no action needed
- **31-50**: Mild — monitor; suggest lighter schedule if energy is also low
- **51-70**: Elevated — flag for Health Agent; reduce task load; recommend stress management
- **71-85**: High — alert workspace owner; block critical task assignments; generate Mediator Agent intervention suggestions
- **86-100**: Critical — emergency notification; auto-delegate all tasks; suggest professional support resources

**Update Mechanisms:**
1. **Manual**: Members can self-report energy and stress levels via the Settings page
2. **Task-based inference**: When tasks are completed or overdue, the system infers energy/stress changes based on task density and completion patterns
3. **AI-assisted**: During analysis runs, the Health Agent may suggest energy/stress updates based on behavioral patterns
4. **Automatic de-escalation**: If energy drops below 40 or stress rises above 70 without manual update, the system auto-adjusts by 10 points in the concerning direction and notifies the member for confirmation

### Constraint Enforcement

Member constraints are hard boundaries that the AI respects without exception. When a task assignment or scheduling suggestion would violate a constraint, the Planner Agent rejects the assignment and logs the reason:

```json
{
  "constraints": {
    "noWorkOnSundays": true,
    "maxDailyMeetings": 4,
    "maxEnergyCostPerDay": 60,
    "medicalRestrictions": ["noPhysicalExertion"],
    "minimumRestHours": 8
  }
}
```

When a task is created with `assignedToId` pointing to a member whose constraints would be violated, the task receives `aiRejected: true` with a reason: "Cannot assign: member has a 'No work on Sundays' constraint and this task is due on Sunday." The member or Owner can override the rejection, but it is explicitly flagged.

### Preference Utilization

Preferences are soft signals that influence but do not dictate AI behavior. The system uses preferences to optimize task assignment and scheduling when multiple valid options exist:

```json
{
  "preferences": {
    "preferredWorkHours": "06:00-14:00",
    "preferredTaskDuration": "short",
    "financialReviewDay": "saturday",
    "notificationStyle": "summary",
    "suggestionFrequency": "daily"
  }
}
```

When the Planner Agent has three equally-qualified members for a task, it uses preferences as a tiebreaker. When the Finance Agent generates weekly reports, it delivers them on the member's preferred review day. Preferences do not override constraints, budget rules, or safety mechanisms — they only influence choices within safe boundaries.

---

## 10. Workspace & Subscription Design

### Workspace Types

Workspaces are the fundamental unit of multi-tenancy and data isolation. Every piece of domain data — tasks, accounts, transactions, vault documents, memories, suggestions, agent logs — belongs to exactly one workspace. There is no cross-workspace data access, even for the same user.

| Type | Purpose | Default Members | Typical Use |
|------|---------|-----------------|-------------|
| **personal** | Individual decision intelligence | 1 (self) | Solo professionals managing finances, schedule, and goals |
| **family** | Household coordination and shared decision-making | 2-5 | Families managing shared finances, children's education, and household schedules |
| **company** | Team operations and resource management | 5-50 | Small teams tracking project budgets, task allocation, and team wellness |

Workspace type influences:
- **Default role assignments**: Personal workspaces auto-assign Owner to the creator; Family workspaces suggest aliases like "Ayah/Ibu"; Company workspaces use professional titles
- **Agent behavior**: The Mediator Agent operates differently in family contexts (interpersonal harmony focus) vs. company contexts (productivity and fairness focus)
- **Vault scope defaults**: Family workspaces default to `family` scope; Company workspaces default to `workspace` scope
- **Member limits**: Enforced by subscription tier (see below)

### Subscription Tiers

Famlyzer AI operates on a paid model with a 7-day free trial. There is no permanent free tier — the value of AI intelligence must be paid for. The Free tier exists as a limited introduction, not as a sustainable product.

| Feature | Free | Professional ($19/mo) | Business ($49/mo) |
|---------|------|----------------------|-------------------|
| **Workspaces** | 1 | 5 | Unlimited |
| **Members per workspace** | 3 | 15 | Unlimited |
| **Autonomous Level** | 0-1 only | 0-2 | 0-3 (Full) |
| **AI Agent Runs** | 5/day | 50/day | Unlimited |
| **Memory Entries** | 100 | 1,000 | Unlimited |
| **Vault Documents** | 10 | 100 | Unlimited |
| **Finance Accounts** | 2 | 10 | Unlimited |
| **Budget Rules** | 3 | 25 | Unlimited |
| **Financial Goals** | 3 | 15 | Unlimited |
| **AI Chat Messages** | 10/day | 100/day | Unlimited |
| **Priority Support** | — | Email | Dedicated |
| **Data Export** | — | CSV | CSV + API |

### 7-Day Free Trial

Every new workspace receives a 7-day free trial with full Business-tier features. The trial is designed to let users experience the full power of the system before committing:

**Trial Flow:**
1. **Day 0**: User creates workspace. `trialStart` and `trialEnd` are set (7 days from creation). All Business-tier limits are active.
2. **Days 1-5**: Full access. The system generates a daily "trial insight" — a high-value AI finding that demonstrates the platform's intelligence (e.g., "You could save $240/month by consolidating these 3 subscriptions").
3. **Day 5**: First trial reminder. A non-intrusive notification: "Your trial ends in 2 days. Here's what you've accomplished with Famlyzer AI..." showing a summary of insights generated and actions taken.
4. **Day 6**: Final reminder with tier comparison: "Choose your plan to keep your AI agents working."
5. **Day 7 (Trial End)**:
   - If no subscription is active, the workspace is downgraded to Free tier
   - Data created during the trial is preserved but becomes read-only if it exceeds Free tier limits
   - Autonomous level is reset to 1 (Suggest) if it was set to 2+
   - A grace period of 3 days allows the user to subscribe without losing access to trial data
6. **Day 10 (End of Grace)**: If still no subscription, excess data remains accessible in read-only mode. The user can export or delete data at any time.

**Trial Constraints:**
- Only one trial per user
- Trial status is tracked on the Workspace model (`trialStart`, `trialEnd`)
- The `subscriptionTier` field remains `free` during trial; trial status is determined by date comparison
- At Level 3 during trial, auto-veto still applies — the trial does not bypass safety mechanisms

### Billing Integration

Subscription management is handled through Stripe with the following flow:

**Checkout Flow:**
1. User selects a tier on the Settings page
2. Frontend calls `POST /api/subscriptions` with tier and period
3. Backend creates a Stripe Checkout Session with the appropriate price ID
4. User is redirected to Stripe Checkout
5. On successful payment, Stripe sends `checkout.session.completed` webhook
6. Webhook handler creates/updates the Subscription record and upgrades the Workspace's `subscriptionTier`
7. Frontend receives confirmation via polling or redirect

**Webhook Events Handled:**
- `checkout.session.completed` → Activate subscription, upgrade workspace tier
- `customer.subscription.updated` → Sync tier changes, handle plan upgrades/downgrades
- `customer.subscription.deleted` → Downgrade to Free tier, preserve data

**Yearly Discount:** Annual subscriptions receive a 20% discount (Professional: $182/year instead of $228, Business: $470/year instead of $588).

### Tier Enforcement

Tier limits are enforced at the API layer, not the UI layer. Every endpoint that creates a resource checks the workspace's subscription tier and current resource count before allowing creation:

```
// Pseudo-code for tier enforcement in account creation
const accountCount = await db.financeAccount.count({ where: { workspaceId } })
const limits = TIER_LIMITS[workspace.subscriptionTier]
if (accountCount >= limits.maxAccounts) {
  return 403 { error: "Account limit reached. Upgrade to add more accounts." }
}
```

This ensures that even if the UI is bypassed (direct API calls), tier limits are respected. The UI additionally disables creation buttons and shows upgrade prompts when limits are approached.

---

## 11. Security & Privacy Design

### Authentication Architecture

Famlyzer AI uses NextAuth.js v4 with the Credentials provider and JWT session strategy. The authentication system is designed for simplicity, security, and horizontal scalability:

**Registration Flow:**
1. User submits email, optional name, and password via the onboarding page
2. `POST /api/auth/setup` validates input with Zod schema (email format, password min 8 chars)
3. Rate limiting: max 10 registration attempts per 15 minutes per IP
4. Password is hashed with bcrypt at cost factor 12 (approximately 250ms per hash)
5. User record is created in the database
6. A default Personal workspace is auto-created with the user as Owner
7. User is redirected to sign-in

**Session Management:**
- **Strategy**: JWT (stateless) — no database session lookups on every request
- **Token Lifetime**: 7 days (604,800 seconds)
- **Token Storage**: `HttpOnly`, `Secure` cookie named `next-auth.session-token`
- **Token Contents**: User ID (CUID) and email — no sensitive data in tokens
- **Token Signing**: `NEXTAUTH_SECRET` environment variable (32+ character random string)
- **Token Validation**: Edge middleware validates the JWT on every API request

**Password Security:**
- Minimum length: 8 characters
- Hashing: bcrypt with cost factor 12
- Passwords are never logged, never returned in API responses, never included in error messages
- Password reset is handled via email verification (planned feature)

### Role-Based Access Control (RBAC)

Access control operates at two layers — middleware (coarse-grained) and route handlers (fine-grained):

**Middleware Layer (`src/middleware.ts`):**
- Validates JWT token on every `/api/*` request (except `/api/auth/*` and `GET /api`)
- When a workspace ID is present in the URL path (`/api/workspaces/:id/*`), queries the `WorkspaceMember` table to verify membership
- Non-members receive an immediate 403 Forbidden response
- This prevents any unauthorized data access at the infrastructure level

**Route Handler Layer:**
- After middleware passes, individual route handlers check the member's role for fine-grained authorization
- Role hierarchy: Owner > Admin > Member

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| Delete workspace | ✅ | ❌ | ❌ |
| Change autonomous level | ✅ | ❌ | ❌ |
| Manage members (add/remove) | ✅ | ✅ | ❌ |
| Update workspace settings | ✅ | ✅ | ❌ |
| Create tasks/transactions | ✅ | ✅ | ✅ |
| Use AI features | ✅ | ✅ | ✅ |
| Read all workspace data | ✅ | ✅ | ✅ (within visibility scope) |
| Override AI veto | ✅ | ✅ | ❌ |
| Manage subscription | ✅ | ❌ | ❌ |

### Data Isolation

Multi-tenancy is enforced at the database level through workspace-scoped foreign keys:

- **Every domain model** (Task, FinanceAccount, Transaction, BudgetRule, FinancialGoal, VaultDocument, Memory, Suggestion, AgentLog) has a `workspaceId` foreign key with cascade delete
- **All queries** include `where: { workspaceId }` — there are no workspace-agnostic data access patterns
- **Cross-workspace data access is architecturally impossible** — no API endpoint accepts data from multiple workspaces in a single request
- **Cascade delete**: When a workspace is deactivated (`isActive: false`), all associated data remains in the database but is inaccessible. Hard deletion requires Owner action and a 30-day confirmation window

### Privacy & GDPR Compliance

Famlyzer AI handles sensitive personal and financial data. The privacy architecture is designed to exceed GDPR requirements:

**Data Minimization:**
- The system collects only what is necessary for its core functions
- Optional fields are truly optional — the system degrades gracefully when they are empty
- Energy and stress levels are user-reported, not inferred from invasive data sources

**Right to Access (GDPR Article 15):**
- Users can export all their data via the Settings page (Business tier: API access; Professional tier: CSV export)
- Export includes all workspace data, memories, suggestions, agent logs, and vault documents

**Right to Erasure (GDPR Article 17):**
- Users can request complete data deletion via the Settings page
- Deletion is a two-step process: soft delete (deactivate) → 30-day confirmation → hard delete
- Hard delete cascades through all related data via Prisma cascade delete rules
- Agent logs are anonymized rather than deleted for system integrity (reasoning is preserved but PII is removed)

**Right to Portability (GDPR Article 20):**
- Data export is available in structured CSV format
- API access (Business tier) enables programmatic data portability

**Data Processing Principles:**
- AI processing occurs on the server side — user data is never sent to the client for AI operations
- The AI provider (z-ai-web-dev-sdk) is treated as a data processor under GDPR
- Prompt injection prevention (`sanitizeAiInput`) strips common injection patterns before data enters the AI pipeline
- AI-generated content is clearly labeled as such — no AI output is presented as human-authored

**Prompt Injection Defense:**
The `sanitizeAiInput()` function applies multiple filters before user input reaches the AI:
- Strip `<system>`, `<instruction>`, `<prompt>`, `<ignore>` tags
- Filter "ignore previous instructions" patterns
- Filter "you are now", "act as", "pretend to be" patterns
- Enforce maximum input length (5,000 characters default)
- The `role` field in chat messages is restricted to `user` or `assistant` — `system` role is never accepted from the client

### Rate Limiting

All API endpoints are protected by rate limiting to prevent abuse:

- **General API**: 60 requests per minute per user
- **Auth endpoints**: 10 requests per 15 minutes per IP
- **AI endpoints**: Varies by subscription tier (5/50/unlimited per day)
- **Implementation**: In-memory sliding window with automatic cleanup every 5 minutes
- **Production note**: The in-memory rate limiter should be replaced with Redis-backed rate limiting for multi-instance deployments

---

## 12. User Interface Design

### Application Architecture

Famlyzer AI is a single-page application (SPA) built within Next.js. The root page (`src/app/page.tsx`) renders the `AppLayout` component, which manages tab-based navigation across six views. There are no client-side routes — navigation is handled through Zustand state (`activeTab`), enabling instant tab switches without page reloads. The layout follows a sidebar + main content pattern optimized for decision intelligence rather than casual browsing.

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────────┐ ┌────────────────────────────────────┐ │
│ │              │ │                                    │ │
│ │   Sidebar    │ │      Main Content Area             │ │
│ │   256px      │ │      (scrollable)                  │ │
│ │              │ │                                    │ │
│ │  ┌────────┐  │ │  ┌──────────────────────────────┐  │ │
│ │  │ Logo   │  │ │  │ Page Header + Actions        │  │ │
│ │  └────────┘  │ │  └──────────────────────────────┘  │ │
│ │  ┌────────┐  │ │  ┌──────────┬───────────────────┐  │ │
│ │  │WS Sel  │  │ │  │ Stat     │ Stat Cards        │  │ │
│ │  └────────┘  │ │  │ Cards    │ (2 or 4 columns)  │  │ │
│ │  ┌────────┐  │ │  └──────────┴───────────────────┘  │ │
│ │  │ Nav    │  │ │  ┌──────────┬───────────────────┐  │ │
│ │  │ Items  │  │ │  │ Charts   │ Data Panels       │  │ │
│ │  └────────┘  │ │  │ (Area,   │ (Lists, Tables,   │  │ │
│ │  ┌────────┐  │ │  │  Bar,    │  Progress Bars)   │  │ │
│ │  │Status  │  │ │  │  Pie)    │                    │  │ │
│ │  └────────┘  │ │  └──────────┴───────────────────┘  │ │
│ │  ┌────────┐  │ │  ┌──────────────────────────────┐  │ │
│ │  │ User   │  │ │  │ AI Suggestions / Log Panel   │  │ │
│ │  └────────┘  │ │  └──────────────────────────────┘  │ │
│ │              │ │                                    │ │
│ └──────────────┘ └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Six-Section Navigation

| Section | Icon | Component | Primary Content |
|---------|------|-----------|-----------------|
| **Dashboard** | `LayoutDashboard` | `dashboard.tsx` | Summary stats, cashflow chart, energy/stress bars, agent network grid, AI decision log, predictions |
| **Planner** | `CalendarCheck` | `planner.tsx` | Task pipeline (Pending → Approved → Done), week view, AI optimization, task creation with multi-cost dimensions |
| **Finance** | `Wallet` | `finance.tsx` | Account cards, transaction list, budget progress, goal tracking, AI audit, auto-veto alerts |
| **Vault** | `Lock` | `vault.tsx` | Document list by type, scope filters, document viewer/editor, AI-powered search |
| **AI Assistant** | `MessageSquare` | `ai-assistant.tsx` | Multi-agent chat interface, agent selector, context display, suggestion cards |
| **Settings** | `Settings` | `settings.tsx` | Workspace config, member management, autonomous level, subscription, data export, preferences |

### Sidebar Design

The sidebar provides persistent navigation and workspace context:

- **Logo**: Famlyzer AI brand mark with emerald-to-teal gradient
- **Workspace Selector**: Dropdown showing all workspaces the user belongs to, with type badge (Personal/Family/Company)
- **Navigation Items**: Six items with icons, active state highlighting (`bg-emerald-100 text-emerald-700` light / `bg-emerald-950 text-emerald-400` dark), and badge support (e.g., "3" for pending suggestions)
- **Autonomous Level Indicator**: Visual display of current workspace autonomous level with color coding (gray=0, blue=1, amber=2, emerald=3)
- **User Section**: Avatar, name, and email at the bottom with sign-out action

**Mobile Behavior:** On screens < 1024px, the sidebar becomes a Sheet overlay triggered by a hamburger button. Selecting a navigation item closes the sheet. A bottom navigation bar is not used — the sheet sidebar provides sufficient mobile navigation.

### Color System

The color palette is designed for purposeful communication, not decoration:

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Emerald 500 | `#10b981` | Active states, positive trends, primary actions, AI indicators |
| **Primary Hover** | Emerald 600 | `#059669` | Hover states, emphasis |
| **Secondary** | Teal 500 | `#14b8a6` | Secondary accent, gradient endpoint |
| **Danger** | Red 500 | `#ef4444` | Overspending, critical alerts, veto warnings, AI rejection |
| **Warning** | Amber 500 | `#f59e0b` | Moderate risk, approaching limits, trial status |
| **AI Indicator** | Purple 500 | `#8b5cf6` | AI-generated content, decision logs, suggestions |
| **Information** | Blue 500 | `#3b82f6` | Preventive suggestions, tips, contextual help |

Buttons follow the gradient pattern for primary actions: `bg-gradient-to-r from-emerald-500 to-teal-600 text-white`. This creates a distinctive visual identity while maintaining accessibility through sufficient contrast ratios.

### Responsive Design

The interface adapts across two primary breakpoints:

| Element | Mobile (< 1024px) | Desktop (≥ 1024px) |
|---------|-------------------|---------------------|
| **Sidebar** | Sheet overlay (triggered by hamburger) | Fixed 256px sidebar |
| **Stat Cards** | 2-column grid | 4-column grid |
| **Chart Row** | Single column (stacked) | 2-column (side-by-side) |
| **Agent Grid** | 2-column compact | 7-column full |
| **Task Pipeline** | Single column (vertical tabs) | 3-column (Pending / Approved / Done) |
| **Account Cards** | Single column | 3-column grid |
| **Finance Tabs** | Horizontal scroll | Standard tab bar |

### Animation & Interaction Patterns

Animations are subtle and purposeful — they communicate state changes and guide attention, never distract:

**Page Transitions:** When switching tabs, content fades in with a slight upward motion (`opacity: 0 → 1, y: 8 → 0, duration: 200ms`). This provides spatial continuity without sluggishness.

**Card Entries:** Cards enter with staggered animations (`delay: index * 0.05`), creating a cascading reveal effect that draws the eye naturally down the page.

**Loading States:** Three distinct loading patterns:
- **Skeleton cards** (`animate-pulse`): Used for initial data loading when the layout is known
- **Button loading**: Disabled state with spinner text ("Analyzing...", "Saving...")
- **AI thinking**: Three-dot bounce animation in the chat interface during AI response generation

**AI Veto Alert:** When the Finance Agent triggers an auto-veto, a red alert card slides in at the top of the Finance page with the warning icon, category name, current spending vs. limit, and a "View Details" action. The alert cannot be dismissed until the user acknowledges it.

**Task AI Rejection:** Tasks rejected by the AI appear in the Pending column with a red banner showing "AI Rejected" and the rejection reason. The banner is prominent but not alarming — it uses a soft red background (`bg-red-100 text-red-700`) rather than a hard error state, reflecting that this is guidance, not a block.

### Data Visualization

Charts use Recharts with a consistent style:
- **Area Chart**: Cashflow over time (income vs. expenses), with emerald fill for income and red fill for expenses
- **Bar Chart**: Energy and stress levels per member, with amber for stress and emerald for energy
- **Progress Bars**: Budget rule compliance (emerald for under-limit, amber for near-limit, red for over-limit), goal progress, emergency fund coverage
- **Pie Chart**: Expense breakdown by category (for monthly summaries)

All charts support dark mode through CSS variable-based theming. Chart tooltips show exact values with currency formatting. Charts are interactive — clicking a bar or area segment filters the related data table.

### Design Philosophy Summary

The UI design philosophy can be summarized in four principles:

1. **Clarity over beauty** — Every element must earn its place. If it doesn't help the user make a better decision, it doesn't belong.
2. **Signal, not noise** — Color and animation convey meaning. Emerald means positive/actionable, red means danger/attention, purple means AI-generated. No element uses color purely for decoration.
3. **Calm confidence** — The interface should feel like a trusted advisor sitting across the table, not an alarm system screaming from the wall. Even critical alerts are presented with clear information and actionable next steps, not just red text and exclamation marks.
4. **Progressive disclosure** — Show the summary first, reveal the details on demand. The dashboard shows 4 stat cards and a chart. Clicking any card expands to the full detail view. This respects the user's attention and prevents information overload.

---

*This design document is a living specification. As Famlyzer AI evolves through user feedback and production experience, each section should be updated to reflect the current state of the system. The document serves as the authoritative reference for product decisions, engineering implementation, and AI behavior design.*
