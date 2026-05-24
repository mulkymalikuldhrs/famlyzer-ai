# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Famlyzer AI, please report it responsibly:

**📧 Email**: [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

**⚠️ IMPORTANT**: Do NOT open a public GitHub issue for security vulnerabilities.

### What to Include

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if you have one)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Resolution**: Depends on severity — critical issues are prioritized

### Responsible Disclosure

We ask that you:

- Give us reasonable time to fix the issue before public disclosure
- Do not access or modify other users' data
- Do not degrade the service (e.g., via DoS)

We appreciate responsible disclosure and will credit security researchers in our release notes.

## Supported Versions

| Version | Supported |
|:--------|:----------|
| 4.0.x | ✅ Yes |
| < 4.0 | ❌ No |

## Security Features

Famlyzer AI implements the following security measures:

- bcrypt password hashing (12 salt rounds)
- JWT session management with 7-day expiry
- Rate limiting on all API routes
- Zod input validation on all endpoints
- Security headers (HSTS, X-Frame-Options, etc.)
- AI prompt injection prevention
- Workspace-scoped data isolation
- Atomic financial transactions
- Sacred budget enforcement at all autonomous levels
