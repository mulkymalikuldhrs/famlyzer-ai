<div align="center">

<!-- Animated Header -->
<img src="public/logo.svg" alt="Famlyzer AI Logo" width="120" height="120" />

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" alt="⚡" width="40" height="40" /> Famlyzer AI

### **Autonomous AI Decision & Planning Intelligence**

> *Life · Family · Team · Finance — One AI to rule them all*

<p>
<img src="https://img.shields.io/badge/version-4.0.0-00C853?style=for-the-badge&logo=semantic-release&logoColor=white" alt="Version" />
<img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>
<p>
<img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
<img src="https://img.shields.io/badge/Stripe-22-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/Zustand-5-FF6B35?style=for-the-badge" alt="Zustand" />
<img src="https://img.shields.io/badge/License-Proprietary-DC2626?style=for-the-badge" alt="License" />
</p>

<p>
<a href="https://github.com/mulkymalikuldhrs/famlyzer-ai/stargazers"><img src="https://img.shields.io/github/stars/mulkymalikuldhrs/famlyzer-ai?style=social" alt="Stars" /></a>
<a href="https://github.com/mulkymalikuldhrs/famlyzer-ai/watchers"><img src="https://img.shields.io/github/watchers/mulkymalikuldhrs/famlyzer-ai?style=social" alt="Watchers" /></a>
<a href="https://github.com/mulkymalikuldhrs/famlyzer-ai/forks"><img src="https://img.shields.io/github/forks/mulkymalikuldhrs/famlyzer-ai?style=social" alt="Forks" /></a>
<a href="https://github.com/mulkymalikuldhrs/famlyzer-ai/issues"><img src="https://img.shields.io/github/issues/mulkymalikuldhrs/famlyzer-ai?style=social" alt="Issues" /></a>
</p>

---

<!-- Language Switcher -->
<a href="#-english"><img src="https://img.shields.io/badge/README-English-1A73E8?style=flat-square" /></a>
<a href="#-bahasa-indonesia"><img src="https://img.shields.io/badge/README-Bahasa_Indonesia-E53935?style=flat-square" /></a>
<a href="#-中文"><img src="https://img.shields.io/badge/README-中文-C62828?style=flat-square" /></a>

</div>

---

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- 🇬🇧 ENGLISH -->
<!-- ═══════════════════════════════════════════════════════════ -->

<a id="-english"></a>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Americas.png" width="28" height="28" /> English

> **We sell access to intelligence, memory, and AI's ability to think & act.**

Famlyzer AI is a production SaaS platform that manages **time, money, energy, relationships, and life goals** in one unified system — with AI as the operator, not just an assistant. Seven specialized AI agents operate across four autonomous levels, powered by a four-layer memory system, a Knowledge Vault as the single source of truth, and financial intelligence with sacred-budget auto-veto — all within workspace-scoped multi-tenant isolation.

### ✨ Highlights

<table>
<tr>
<td width="50%">

#### 🤖 7 Autonomous AI Agents
Planner · Finance · Mediator · Health · Education · Memory · Executive

</td>
<td width="50%">

#### 🧠 4-Layer Memory System
Short-term → Long-term → Decision → Emotional

</td>
</tr>
<tr>
<td width="50%">

#### 🛡️ 4-Level Autonomous System
Observe → Suggest → Act (confirm) → Full Autonomous

</td>
<td width="50%">

#### 🏦 Financial Intelligence
Sacred budget auto-veto · Multi-account · Anomaly detection

</td>
</tr>
<tr>
<td width="50%">

#### 📚 Knowledge Vault
Single source of truth — Vault > Memory > Assumption

</td>
<td width="50%">

#### 💳 SaaS Ready
Stripe billing · 3-tier pricing · 7-day free trial

</td>
</tr>
</table>

### 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai && bun install

# Configure
cp .env.example .env   # Edit with your PostgreSQL, NextAuth, Stripe keys

# Database
bun run db:generate && bun run db:push

# Launch
bun run dev             # → http://localhost:3000
```

### 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| Framework | Next.js 16 (App Router) | SSR, API routes, standalone output |
| Language | TypeScript 5 | End-to-end type safety |
| UI | React 19 + shadcn/ui | 50+ accessible components |
| Database | PostgreSQL + Prisma 6 | 13 models, 30+ indexes |
| State | Zustand 5 + TanStack Query | Global UI + server cache |
| AI | z-ai-web-dev-sdk | 7 specialized agents |
| Payments | Stripe 22 | Checkout, webhooks, subscriptions |
| Styling | Tailwind CSS 4 + Framer Motion | Utility-first + animations |

### 📊 Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Client (SPA)                               │
│  React 19 · Zustand · TanStack Query        │
└──────────────────────┬──────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────┐
│  Next.js 16 Server                          │
│  Middleware → Auth → Validate → Execute      │
├──────────┬───────────────┬──────────────────┤
│ Prisma   │ z-ai-sdk      │ Stripe           │
│ (PG)     │ (7 Agents)    │ (Payments)       │
└──────────┴───────────────┴──────────────────┘
```

### 💰 Pricing

| | **Free** | **Professional** | **Business** |
|:--|:--|:--|:--|
| **Price** | $0/mo | $19/mo or $190/yr | $49/mo or $490/yr |
| **Workspaces** | 1 | 5 | Unlimited |
| **AI Calls/Day** | 10 | 100 | Unlimited |
| **Vault Docs** | 50 | 500 | Unlimited |
| **Autonomous Level** | 1 (Suggest) | 1–3 (Full range) | 1–3 (Full range) |

### 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feat/amazing-feature`)
3. ✅ Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. 📤 Push to the branch (`git push origin feat/amazing-feature`)
5. 🎉 Open a Pull Request

### 📬 Contact

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

---

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- 🇮🇩 BAHASA INDONESIA -->
<!-- ═══════════════════════════════════════════════════════════ -->

<a id="-bahasa-indonesia"></a>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Flag%20Indonesia.png" width="28" height="28" /> Bahasa Indonesia

> **Kami menjual akses ke kecerdasan, memori, dan kemampuan AI untuk berpikir & bertindak.**

Famlyzer AI adalah platform SaaS produksi yang mengelola **waktu, uang, energi, hubungan, dan tujuan hidup** dalam satu sistem terpadu — dengan AI sebagai operator, bukan sekadar asisten. Tujuh agen AI khusus beroperasi di empat level otonom, ditenagai oleh sistem memori empat lapis, Knowledge Vault sebagai sumber kebenaran tunggal, dan kecerdasan keuangan dengan vetoot otomatis anggaran suci — semuanya dalam isolasi multi-tenant berbasis ruang kerja.

### ✨ Fitur Unggulan

<table>
<tr>
<td width="50%">

#### 🤖 7 Agen AI Otonom
Planner · Finance · Mediator · Health · Education · Memory · Executive

</td>
<td width="50%">

#### 🧠 Sistem Memori 4 Lapis
Jangka Pendek → Jangka Panjang → Keputusan → Emosional

</td>
</tr>
<tr>
<td width="50%">

#### 🛡️ Sistem Otonom 4 Level
Amati → Sarankan → Bertindak (konfirmasi) → Otonom Penuh

</td>
<td width="50%">

#### 🏦 Kecerdasan Keuangan
Veto otomatis anggaran suci · Multi-akun · Deteksi anomali

</td>
</tr>
<tr>
<td width="50%">

#### 📚 Knowledge Vault
Sumber kebenaran tunggal — Vault > Memori > Asumsi

</td>
<td width="50%">

#### 💳 Siap SaaS
Billing Stripe · 3 tingkat harga · Uji coba gratis 7 hari

</td>
</tr>
</table>

### 🚀 Mulai Cepat

```bash
# Klon & Instal
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai && bun install

# Konfigurasi
cp .env.example .env   # Isi dengan PostgreSQL, NextAuth, kunci Stripe Anda

# Database
bun run db:generate && bun run db:push

# Jalankan
bun run dev             # → http://localhost:3000
```

### 🏗️ Teknologi

| Lapisan | Teknologi | Fungsi |
|:--------|:----------|:-------|
| Framework | Next.js 16 (App Router) | SSR, API routes, standalone output |
| Bahasa | TypeScript 5 | Keamanan tipe end-to-end |
| UI | React 19 + shadcn/ui | 50+ komponen aksesibel |
| Database | PostgreSQL + Prisma 6 | 13 model, 30+ indeks |
| State | Zustand 5 + TanStack Query | UI global + cache server |
| AI | z-ai-web-dev-sdk | 7 agen khusus |
| Pembayaran | Stripe 22 | Checkout, webhooks, langganan |
| Styling | Tailwind CSS 4 + Framer Motion | Utilitas + animasi |

### 💰 Harga

| | **Gratis** | **Profesional** | **Bisnis** |
|:--|:--|:--|:--|
| **Harga** | $0/bln | $19/bln atau $190/thn | $49/bln atau $490/thn |
| **Workspace** | 1 | 5 | Tak Terbatas |
| **Panggilan AI/Hari** | 10 | 100 | Tak Terbatas |
| **Dokumen Vault** | 50 | 500 | Tak Terbatas |
| **Level Otonom** | 1 (Sarankan) | 1–3 (Penuh) | 1–3 (Penuh) |

### 🤝 Berkontribusi

Kami menyambut kontribusi! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan.

1. 🍴 Fork repositori ini
2. 🌿 Buat branch fitur Anda (`git checkout -b feat/fitur-keren`)
3. ✅ Commit perubahan Anda (`git commit -m 'feat: tambah fitur keren'`)
4. 📤 Push ke branch (`git push origin feat/fitur-keren`)
5. 🎉 Buka Pull Request

### 📬 Kontak

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

---

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- 🇨🇳 中文 -->
<!-- ═══════════════════════════════════════════════════════════ -->

<a id="-中文"></a>

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Flag%20China.png" width="28" height="28" /> 中文

> **我们出售的是智能、记忆和AI思考与行动的能力。**

Famlyzer AI 是一个生产级 SaaS 平台，将**时间、金钱、精力、关系和生活目标**统一管理——AI 是操作者，而不仅仅是助手。七个专业 AI 代理在四个自主级别上运行，由四层记忆系统、作为唯一真相来源的知识库和具有神圣预算自动否决的金融智能驱动——所有这些都在工作区范围的多租户隔离中运行。

### ✨ 核心亮点

<table>
<tr>
<td width="50%">

#### 🤖 7 个自主 AI 代理
规划 · 财务 · 调解 · 健康 · 教育 · 记忆 · 执行

</td>
<td width="50%">

#### 🧠 四层记忆系统
短期 → 长期 → 决策 → 情感

</td>
</tr>
<tr>
<td width="50%">

#### 🛡️ 四级自主系统
观察 → 建议 → 行动（需确认）→ 完全自主

</td>
<td width="50%">

#### 🏦 金融智能
神圣预算自动否决 · 多账户 · 异常检测

</td>
</tr>
<tr>
<td width="50%">

#### 📚 知识库
唯一真相来源 — 知识库 > 记忆 > 假设

</td>
<td width="50%">

#### 💳 SaaS 就绪
Stripe 计费 · 三层定价 · 7 天免费试用

</td>
</tr>
</table>

### 🚀 快速开始

```bash
# 克隆 & 安装
git clone https://github.com/mulkymalikuldhrs/famlyzer-ai.git
cd famlyzer-ai && bun install

# 配置
cp .env.example .env   # 填写 PostgreSQL、NextAuth、Stripe 密钥

# 数据库
bun run db:generate && bun run db:push

# 启动
bun run dev             # → http://localhost:3000
```

### 🏗️ 技术栈

| 层级 | 技术 | 用途 |
|:-----|:-----|:-----|
| 框架 | Next.js 16 (App Router) | SSR、API路由、独立输出 |
| 语言 | TypeScript 5 | 端到端类型安全 |
| 界面 | React 19 + shadcn/ui | 50+ 无障碍组件 |
| 数据库 | PostgreSQL + Prisma 6 | 13 个模型、30+ 索引 |
| 状态 | Zustand 5 + TanStack Query | 全局UI + 服务器缓存 |
| AI | z-ai-web-dev-sdk | 7 个专业代理 |
| 支付 | Stripe 22 | 结账、Webhooks、订阅 |
| 样式 | Tailwind CSS 4 + Framer Motion | 实用优先 + 动画 |

### 💰 定价

| | **免费版** | **专业版** | **企业版** |
|:--|:--|:--|:--|
| **价格** | $0/月 | $19/月 或 $190/年 | $49/月 或 $490/年 |
| **工作区** | 1 | 5 | 无限制 |
| **AI 调用/天** | 10 | 100 | 无限制 |
| **知识库文档** | 50 | 500 | 无限制 |
| **自主级别** | 1（建议） | 1–3（完整） | 1–3（完整） |

### 🤝 参与贡献

欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

1. 🍴 Fork 本仓库
2. 🌿 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. ✅ 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 📤 推送到分支 (`git push origin feat/amazing-feature`)
5. 🎉 发起 Pull Request

### 📬 联系方式

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

---

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- SHARED SECTION - Documentation & Links -->
<!-- ═══════════════════════════════════════════════════════════ -->

## 📖 Documentation / Dokumentasi / 文档

| Document | Description |
|:---------|:------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, data model, auth flow, security |
| [DESIGN.md](DESIGN.md) | Product design, agent architecture, memory system, UI |
| [CHANGELOG.md](CHANGELOG.md) | Version history (v1.0.0 → v4.0.0) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, code standards, workflow |

## 🌟 Star History

<a href="https://star-history.com/#mulkymalikuldhrs/famlyzer-ai&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mulkymalikuldhrs/famlyzer-ai&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mulkymalikuldhrs/famlyzer-ai&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mulkymalikuldhrs/famlyzer-ai&type=Date" />
 </picture>
</a>

## 🛡️ Security

Found a vulnerability? Please report it privately to [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com) — do **not** open a public issue.

## 📄 License

Proprietary — All rights reserved. See [LICENSE](LICENSE) for details.

---

<div align="center">

### Made with ❤️ by [Mulky Malikul Dhaher](https://github.com/mulkymalikuldhrs)

<img src="https://komarev.com/ghpvc/?username=mulkymalikuldhrs&label=Profile%20Views&color=0e75b6&style=flat" alt="Profile Views" />

[![GitHub Follow](https://img.shields.io/github/followers/mulkymalikuldhrs?style=social)](https://github.com/mulkymalikuldhrs)
[![Twitter Follow](https://img.shields.io/twitter/follow/mulkymalikuldhrs?style=social)](https://twitter.com/mulkymalikuldhrs)

*Famlyzer AI v4.0.0 — Reduce chaos. Increase clarity. Preserve harmony.*

*减少混乱。增加清晰。保持和谐。*

*Kurangi kekacauan. Tingkatkan kejelasan. Jaga keharmonisan.*

</div>
