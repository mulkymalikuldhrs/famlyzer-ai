## Description

<!-- Provide a clear description of your changes -->

## Type of Change

- [ ] 🆕 New feature (feat)
- [ ] 🐛 Bug fix (fix)
- [ ] 📝 Documentation update (docs)
- [ ] 🎨 Style/formatting (style)
- [ ] ♻️ Code refactoring (refactor)
- [ ] ⚡ Performance improvement (perf)
- [ ] ✅ Test addition/update (test)
- [ ] 🔧 Build/CI/tooling (chore)
- [ ] 🌍 Translation (i18n)

## Related Issue

<!-- Link to the issue this PR addresses -->
Closes #

## Changes Made

<!-- List the key changes -->

-
-
-

## Checklist

- [ ] Code follows the 4-step API route pattern (Auth → Rate Limit → Validate → Execute)
- [ ] All new inputs validated with Zod schemas in `src/lib/validations.ts`
- [ ] No `any` types — TypeScript strict mode passes
- [ ] `bun run lint` passes with zero warnings
- [ ] Financial operations use Prisma `$transaction()` for atomicity
- [ ] No secrets, API keys, or `.env` files committed
- [ ] UI changes are responsive and keyboard accessible
- [ ] Breaking changes are clearly documented

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Additional Notes

<!-- Any other context reviewers should know -->
