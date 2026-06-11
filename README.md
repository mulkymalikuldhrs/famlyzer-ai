<!-- BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=38bdf8&descColor=f472b6&height=220&section=header&text=Famlyzer%20AI&fontSize=70&desc=Decision%20%26%20Planning%20Intelligence&animation=fadeIn" />

<!-- TYPING SVG -->
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=7+AI+Agents+Working+Together;Intelligent+Decision+Support;Family+%26+Life+Planning;Suggestions+Not+Professional+Advice" alt="Typing SVG" />
  </a>
</div>

<br/>

<!-- BADGES -->
<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![AI Agents](https://img.shields.io/badge/AI_Agents-7-F472B6?style=for-the-badge&logo=brain&logoColor=white)](https://github.com/mulkymalikuldhrs/famlyzer-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## Overview

**Famlyzer AI** is a decision and planning intelligence platform powered by 7 specialized AI agents working in concert. Each agent focuses on a different domain of life planning — from financial decisions and career moves to family scheduling and health goals. Together, they provide holistic, context-aware recommendations that consider the interconnected nature of real-life decisions.

Built with TypeScript and Next.js, Famlyzer AI transforms complex multi-domain decisions into structured, actionable plans while keeping humans firmly in the driver's seat.

## Features

### 7 Specialized AI Agents

| Agent | Domain | Focus |
|-------|--------|-------|
| 🧠 **Strategist** | Decision Analysis | Breaks down complex decisions, evaluates trade-offs |
| 💰 **Financier** | Financial Planning | Budget analysis, savings goals, investment considerations |
| 🏥 **HealthGuard** | Health & Wellness | Fitness goals, nutrition planning, health risk awareness |
| 📚 **Scholar** | Education & Skills | Learning paths, skill development, knowledge gaps |
| 🏠 **HomeKeeper** | Family & Home | Scheduling, household management, family coordination |
| 🌍 **Navigator** | Career & Growth | Career moves, professional development, opportunities |
| 🤝 **Mediator** | Conflict Resolution | Interpersonal decisions, compromise suggestions, priorities |

### Multi-Agent Orchestration
- Agents communicate and share context across domains
- Cross-domain impact analysis (e.g., how a career move affects family and finances)
- Consensus-building when agents disagree on recommendations
- Priority-weighted decision scoring

### Decision Workflows
- Structured decision-making frameworks (pros/cons, weighted scoring, scenario analysis)
- Timeline-based planning with milestone tracking
- What-if scenario simulation
- Decision journal with outcomes tracking

### Planning & Organization
- Goal setting with SMART criteria
- Action plan generation with dependencies
- Calendar integration and scheduling
- Progress tracking and plan adjustments

### Collaboration
- Multi-user family accounts
- Shared decision spaces
- Role-based agent interaction
- Exportable plans and reports

## Honest Notes

> **Important context about Famlyzer AI:**

- **Suggestions, Not Professional Advice** — AI recommendations are suggestions to consider, not professional financial, medical, legal, or career advice. Always consult qualified professionals for important decisions.
- **AI Limitations** — The agents operate within the bounds of their training data and may not account for unique personal circumstances, local regulations, or recent changes in markets/policies.
- **No Guarantee of Outcomes** — Following AI recommendations does not guarantee positive results. Life decisions involve factors beyond any AI's ability to predict.
- **Privacy Considerations** — The platform processes personal and potentially sensitive information. Review the privacy policy and understand how your data is used.
- **Human Judgment is Essential** — Famlyzer AI is a thinking tool, not a decision maker. The best outcomes come from combining AI insights with human wisdom and professional guidance.

## Quick Start

### Prerequisites
- Node.js 18+
- API keys for LLM provider(s)

### Installation

```bash
# Clone the repository

<!-- AUTO-PACKAGE-BADGES:START -->

<!-- AUTO-PACKAGE-BADGES:END -->
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Configuration

```env
# LLM Provider
OPENAI_API_KEY=your_key
# or
ANTHROPIC_API_KEY=your_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### Running

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

## Project Structure

```
famlyzer-ai/
├── src/
│   ├── app/                # Next.js app router
│   ├── components/
│   │   ├── agents/         # Agent interaction UI
│   │   ├── decisions/      # Decision workflow views
│   │   ├── plans/          # Planning dashboard
│   │   └── shared/         # Common components
│   ├── lib/
│   │   ├── agents/         # 7 AI agent definitions
│   │   ├── orchestration/  # Multi-agent coordination
│   │   ├── workflows/      # Decision workflow engine
│   │   └── planning/       # Planning & scheduling
│   └── types/              # TypeScript definitions
├── prompts/                # Agent system prompts
└── tests/                  # Test suites
```

## Visual Architecture

> Interactive Mermaid diagrams — viewable on GitHub. These illustrate the multi-agent system design and data flow at a glance.

### 7-Agent Orchestration

```mermaid
flowchart TB
    subgraph User["👤 User Input"]
        Decision[Decision Request]
        Plan[Planning Request]
    end

    subgraph Orchestrator["🎛️ Multi-Agent Orchestrator"]
        Router[Context Router<br/>Determines relevant agents]
        Context[Shared Context Bus<br/>Cross-agent memory & state]
        Consensus[Consensus Engine<br/>Resolves conflicting recommendations]
    end

    subgraph Agents["🤖 7 Specialized Agents"]
        Strategist[🧠 Strategist<br/>Decision analysis & trade-offs]
        Financier[💰 Financier<br/>Budget, savings, investments]
        HealthGuard[🏥 HealthGuard<br/>Fitness, nutrition, risks]
        Scholar[📚 Scholar<br/>Learning paths & skills]
        HomeKeeper[🏠 HomeKeeper<br/>Family & household]
        Navigator[🌍 Navigator<br/>Career & growth]
        Mediator[🤝 Mediator<br/>Conflict resolution & priorities]
    end

    Decision --> Router
    Plan --> Router
    Router --> Context
    Context --> Strategist
    Context --> Financier
    Context --> HealthGuard
    Context --> Scholar
    Context --> HomeKeeper
    Context --> Navigator
    Context --> Mediator
    Strategist --> Consensus
    Financier --> Consensus
    HealthGuard --> Consensus
    Scholar --> Consensus
    HomeKeeper --> Consensus
    Navigator --> Consensus
    Mediator --> Consensus
    Consensus -->|Weighted Recommendation| User
```

### Decision Workflow

```mermaid
flowchart LR
    subgraph Input["📥 Input"]
        A[User describes<br/>decision or goal]
    end

    subgraph Analysis["🔍 Multi-Agent Analysis"]
        B1[Strategist<br/>Pros/Cons]
        B2[Financier<br/>Cost/Benefit]
        B3[HealthGuard<br/>Wellness Impact]
        B4[Scholar<br/>Knowledge Gaps]
        B5[HomeKeeper<br/>Family Impact]
        B6[Navigator<br/>Career Impact]
        B7[Mediator<br/>Stakeholder Views]
    end

    subgraph Synthesis["⚖️ Synthesis"]
        C1[Cross-Domain<br/>Impact Map]
        C2[Priority-Weighted<br/>Scoring]
        C3[Scenario<br/>Simulation]
    end

    subgraph Output["📤 Output"]
        D1[Structured<br/>Recommendation]
        D2[Action Plan<br/>with Milestones]
        D3[Risk Assessment<br/>& Trade-offs]
    end

    A --> Analysis
    B1 --> C1
    B2 --> C1
    B3 --> C1
    B4 --> C2
    B5 --> C2
    B6 --> C3
    B7 --> C3
    C1 --> D1
    C2 --> D2
    C3 --> D3
```

### Cross-Domain Impact

```mermaid
flowchart LR
    Decision["🔑 Example Decision:<br/>Take a New Job"]

    Decision -->|Salary change| Fin["💰 Financial<br/>Income, benefits,<br/>relocation costs"]
    Decision -->|Schedule shift| Home["🏠 Home & Family<br/>Work-life balance,<br/>childcare, commute"]
    Decision -->|Stress level| Health["🏥 Health<br/>Stress, sleep,<br/>exercise routine"]
    Decision -->|Skill growth| Career["🌍 Career<br/>Growth trajectory,<br/>skill development"]
    Decision -->|Time investment| Learn["📚 Education<br/>Time for courses,<br/>certifications"]

    Fin -->|Affects| Home
    Home -->|Affects| Health
    Career -->|Affects| Fin
    Health -->|Affects| Career
    Learn -->|Affects| Career
```

### SaaS Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Next.js 16 Frontend"]
        UI[React UI<br/>App Router]
        AgentUI[Agent Interaction UI]
        DecUI[Decision Workflows]
        PlanUI[Planning Dashboard]
    end

    subgraph API["⚡ API Layer"]
        NextAPI[Next.js API Routes]
        Auth[next-auth<br/>Authentication]
    end

    subgraph Engine["🤖 Agent Engine"]
        Orch[Multi-Agent<br/>Orchestrator]
        Agents[7 AI Agents]
        Memory[Shared Context<br/>& Memory]
    end

    subgraph Data["💾 Data Layer"]
        Prisma[Prisma ORM]
        DB[(Database<br/>PostgreSQL)]
    end

    subgraph Payments["💳 Billing"]
        Stripe[Stripe<br/>Subscriptions]
    end

    Client --> API
    API --> Engine
    Engine --> Agents
    Engine --> Memory
    API --> Data
    Prisma --> DB
    API --> Payments
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/agent-improvement`)
3. Add tests for new functionality
4. Submit a pull request with clear description

Areas of special interest:
- New agent specializations
- Better cross-domain reasoning
- Localization and accessibility
- Decision framework implementations

## Disclaimer

Famlyzer AI provides AI-generated suggestions for personal decision-making and planning. These suggestions are **not** professional financial, medical, legal, career, or any other form of professional advice. Always consult with qualified professionals before making important life decisions. The authors assume no liability for decisions made based on AI-generated recommendations.

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

## Author

<div align="center">

**Mulky Malikul Dhaher**

[![GitHub](https://img.shields.io/badge/GitHub-mulkymalikuldhrs-181717?style=flat-square&logo=github)](https://github.com/mulkymalikuldhrs)
[![Email](https://img.shields.io/badge/Email-mulkymalikudhr@mail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:mulkymalikudhr@mail.com)

</div>

---

<!-- FOOTER BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=38bdf8&descColor=f472b6&height=120&section=footer&text=&fontSize=0" />
