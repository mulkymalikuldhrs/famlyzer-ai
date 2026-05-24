# 🤝 Contributing to Famlyzer AI

> **English** | [Bahasa Indonesia](#bahasa-indonesia) | [中文](#中文)

First off, thank you for considering contributing to Famlyzer AI! 🎉 It's people like you who make this project better. We welcome contributions of all kinds — bug fixes, new features, documentation improvements, translations, and more.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Translation Contributions](#translation-contributions)
- [Contact](#contact)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together. Harassment, discrimination, and toxic behavior will not be tolerated.

---

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
|:------------|:--------|:------|
| Node.js | 18+ | or Bun 1.x |
| PostgreSQL | 15+ | Required for development |
| Bun | 1.x | Package manager |
| Git | 2.x | Version control |

### Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/famlyzer-ai.git
cd famlyzer-ai

# 3. Add upstream remote
git remote add upstream https://github.com/mulkymalikuldhrs/famlyzer-ai.git

# 4. Install dependencies
bun install

# 5. Set up environment
cp .env.example .env
# Fill in your PostgreSQL URL, NextAuth secret, etc.

# 6. Set up database
bun run db:generate
bun run db:push

# 7. Start development server
bun run dev
```

---

## Development Workflow

1. **Sync** your fork with upstream:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create** a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Develop** with hot reload running (`bun run dev`)

4. **Test** your changes thoroughly — every API route must work correctly

5. **Lint** before committing:
   ```bash
   bun run lint
   ```

6. **Commit** using conventional commit format

7. **Push** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

8. **Open** a Pull Request against the `main` branch

### Branch Naming Convention

| Type | Format | Example |
|:-----|:-------|:--------|
| Feature | `feat/description` | `feat/ai-agent-weather` |
| Bug Fix | `fix/description` | `fix/auth-session-expiry` |
| Documentation | `docs/description` | `docs/api-reference-update` |
| Refactor | `refactor/description` | `refactor/memory-layer-queries` |
| Performance | `perf/description` | `perf/dashboard-load-time` |
| Translation | `i18n/description` | `i18n/japanese-translation` |

---

## Code Standards

### API Routes — The 4-Step Pattern

Every API route MUST follow this pattern:

```typescript
// 1. Authenticate — verify session
const session = await getServerSession(authOptions);
if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

// 2. Rate Limit — prevent abuse
const rateLimitOk = await checkRateLimit(session.user.id, 'api');
if (!rateLimitOk) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

// 3. Validate — Zod schema
const body = schema.parse(await request.json());

// 4. Execute — business logic
const result = await prisma.model.create({ data: body });
return NextResponse.json(result);
```

### Validation

- All input schemas in `src/lib/validations.ts` using Zod v4
- Never trust client-side data — always validate on the server
- Pagination must cap at 100 items per page

### TypeScript

- `noImplicitAny: true` is enforced — no `any` types
- Use proper types from Prisma generated client
- Prefer `interface` for object shapes, `type` for unions/intersections

### Components

- Feature components compose `shadcn/ui` primitives from `src/components/ui/`
- Use Tailwind CSS classes — no inline styles
- All interactive elements must be keyboard accessible

### AI

- All AI calls go through `aiChat()` in `src/lib/ai.ts` — never call the SDK directly
- AI inputs must be sanitized via `sanitizeAiInput()`
- Client-side chat messages restricted to `user`/`assistant` roles

### Security

- Never expose `STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, or database URLs to the client
- All financial operations must use Prisma `$transaction()` for atomicity
- Sacred budget rules are enforced at ALL autonomous levels — never bypass

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|:-----|:------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructure, no behavior change |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build, CI, tooling |
| `i18n` | Translation updates |

### Examples

```bash
feat(ai): add weather context to planner agent
fix(finance): correct atomic transaction balance update
docs(readme): add Chinese translation section
i18n(id): complete Bahasa Indonesia translations
```

---

## Pull Request Process

1. **Title** — Use conventional commit format: `feat(scope): description`
2. **Description** — Fill in the PR template completely
3. **Scope** — Keep PRs focused — one feature/fix per PR
4. **Breaking Changes** — Clearly mark in PR title and description
5. **Review** — At least one approval required before merge
6. **CI** — All checks must pass before merge

### PR Checklist

- [ ] Code follows the 4-step pattern for API routes
- [ ] All new inputs validated with Zod schemas
- [ ] No `any` types — TypeScript strict mode passes
- [ ] `bun run lint` passes with zero warnings
- [ ] Database schema changes use `prisma db push` (dev) or `prisma migrate` (production)
- [ ] Security-sensitive operations use `$transaction()` where needed
- [ ] No secrets, API keys, or `.env` files committed

---

## Reporting Bugs

Use the **Bug Report** issue template. Please include:

1. **Steps to reproduce** — numbered, specific
2. **Expected behavior** — what should happen
3. **Actual behavior** — what actually happens
4. **Environment** — OS, Node.js version, browser
5. **Screenshots/Logs** — if applicable

---

## Feature Requests

Use the **Feature Request** issue template. Please include:

1. **Problem** — what pain point does this solve?
2. **Proposed solution** — how should it work?
3. **Alternatives considered** — what else did you think of?
4. **Additional context** — mockups, references, etc.

---

## Translation Contributions

We welcome translations in any language! Famlyzer AI currently supports:

- 🇬🇧 English (primary)
- 🇮🇩 Bahasa Indonesia
- 🇨🇳 中文

To add a new language:

1. Check existing issues for translation requests
2. Open an issue with `i18n` label for your language
3. Follow the `next-intl` message file structure
4. Submit a PR with all message files updated

---

## Contact

**Mulky Malikul Dhaher**
- 📧 Email: [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
- 🐙 GitHub: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

---

<a id="bahasa-indonesia"></a>

## Bahasa Indonesia

Terima kasih atas minat Anda untuk berkontribusi pada Famlyzer AI! Kami menyambut segala jenis kontribusi — perbaikan bug, fitur baru, perbaikan dokumentasi, terjemahan, dan lainnya.

### Alur Kerja

1. 🍴 Fork repositori → 🌿 Buat branch fitur → ✅ Commit → 📤 Push → 🎉 Pull Request
2. Gunakan format commit konvensional (`feat:`, `fix:`, `docs:`, `i18n:`)
3. Setiap route API harus mengikuti pola 4 langkah: Autentikasi → Rate Limit → Validasi → Eksekusi
4. `bun run lint` harus lulus tanpa peringatan sebelum commit
5. Tidak boleh ada tipe `any` — mode ketat TypeScript diberlakukan

### Kontak

📧 [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com) | 🐙 [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

---

<a id="中文"></a>

## 中文

感谢您考虑为 Famlyzer AI 做贡献！我们欢迎各种类型的贡献——错误修复、新功能、文档改进、翻译等。

### 工作流程

1. 🍴 Fork 仓库 → 🌿 创建功能分支 → ✅ 提交 → 📤 推送 → 🎉 发起 Pull Request
2. 使用约定式提交格式 (`feat:`, `fix:`, `docs:`, `i18n:`)
3. 每个 API 路由必须遵循 4 步模式：认证 → 速率限制 → 验证 → 执行
4. 提交前 `bun run lint` 必须通过且无警告
5. 不允许使用 `any` 类型 — 强制执行 TypeScript 严格模式

### 联系方式

📧 [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com) | 🐙 [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
