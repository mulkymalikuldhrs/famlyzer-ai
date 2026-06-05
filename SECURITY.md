# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Famlyzer AI, please report it responsibly:

- **Email**: Create a GitHub Issue with the tag `security` (do not include exploit details publicly)
- **Response time**: We aim to acknowledge reports within 48 hours

## Security Measures

### Authentication & Authorization
- Passwords hashed with bcrypt (cost factor 12)
- JWT-based sessions via NextAuth.js
- Workspace membership + role-based access control enforced in middleware
- Rate limiting on auth endpoints (10 attempts per 15 minutes)

### API Security
- Zod schema validation on all endpoints
- Rate limiting per route type (AI: 5-20/min, API: 60/min, Auth: 10/15min)
- System role blocked from client-side AI message injection
- AI input sanitization against prompt injection patterns

### Data Protection
- Environment variables never committed to git (`.env*` in `.gitignore`)
- Stripe webhook signature verification
- Security headers (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy)
- No ZodError details leaked to clients

### Known Limitations
- Rate limiting is in-memory only (not distributed) — for production, use Redis-based rate limiting
- No rate limiting on workspace-scoped read endpoints within the middleware

## Responsible Disclosure

Please do not publicly disclose vulnerabilities before they have been addressed. We appreciate responsible disclosure and will credit researchers who help improve our security.
