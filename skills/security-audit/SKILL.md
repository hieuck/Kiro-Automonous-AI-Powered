---
name: security-audit
description: >
  Use when performing security reviews, vulnerability assessments, or compliance checks.
  Handles OWASP Top 10, dependency scanning, secrets detection, and access control review.
allowed-tools:
  - Read
  - Grep
  - Glob
  - WebSearch
---

# Security Audit

## Workflow

### 1. Authentication & Authorization
Check:
- Password hashing (bcrypt cost ≥12)
- JWT token security (short expiration, httpOnly cookies)
- Session management
- Multi-factor authentication (if applicable)
- Role-based access control (RBAC)

### 2. Input Validation
Verify:
- All user inputs are validated
- SQL injection prevention (parameterized queries)
- XSS prevention (output escaping)
- CSRF protection
- File upload validation

### 3. Data Protection
Check:
- Encryption at rest
- Encryption in transit (TLS/HTTPS)
- Sensitive data masking in logs
- PII handling compliance
- Secure credential storage

### 4. Dependency Security
Run:
```bash
npm audit
```
- Check for known vulnerabilities
- Update vulnerable dependencies
- Review dependency licenses

### 5. Secrets Detection
Search for:
- API keys in code
- Passwords in code
- Private keys committed
- .env files in git history

Use grep:
```bash
grep -ri "API_KEY\|PASSWORD\|SECRET\|TOKEN" --exclude-dir=node_modules .
git log -p | grep -i "password\|secret\|api_key"
```

### 6. API Security
Verify:
- Rate limiting enabled
- CORS properly configured
- Authentication on all endpoints
- Input validation on all endpoints
- Proper error messages (no stack traces in production)

### 7. Security Headers
Check for:
- HSTS (Strict-Transport-Security)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy

## OWASP Top 10 Checklist

- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Authentication Failures
- [ ] A08: Software and Data Integrity
- [ ] A09: Security Logging Failures
- [ ] A10: Server-Side Request Forgery

## Output Format

**Critical Issues:** [Must fix immediately]
**High Priority:** [Fix before deployment]
**Medium Priority:** [Fix in next sprint]
**Low Priority:** [Nice to have]

**Compliance Status:** [Pass/Fail with details]

## Rules

- Block deployment on critical security issues
- Never commit secrets to git
- Always use parameterized queries
- Validate all user input
- Encrypt sensitive data
- Keep dependencies updated
