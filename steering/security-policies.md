---
inclusion: always
---

# Security Policies

## Authentication & Authorization

### Password Security
- Minimum 8 characters
- Require: uppercase, lowercase, number, special character
- Hash with bcrypt (cost factor 12+) or argon2
- Never store plaintext passwords
- Implement password reset with time-limited tokens

### JWT Tokens
```typescript
// Token structure
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1609459200,
  "exp": 1609545600
}

// Best practices
- Short expiration (15-30 minutes)
- Use refresh tokens for long sessions
- Store securely (httpOnly cookies or secure storage)
- Validate on every request
- Implement token revocation
```

## Input Validation

### Always Validate
- All user inputs
- Query parameters
- Request body
- File uploads
- Headers

## SQL Injection Prevention

### Use Parameterized Queries
```typescript
// ✅ Good - Parameterized
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Bad - String concatenation
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

## XSS Prevention

### Output Encoding
```typescript
// Escape HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

## Secrets Management

### Environment Variables
```bash
# .env (never commit!)
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=your-secret-key-here
API_KEY=your-api-key
```

### Best Practices
- Never commit secrets to git
- Use `.gitignore` for `.env` files
- Rotate secrets regularly
- Different secrets per environment

## HTTPS/TLS

- Enforce HTTPS everywhere
- Use HSTS headers
- TLS 1.2+ only

## Rate Limiting

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: 'Too many requests'
});
```

## Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## AI Security Boundaries
### For 100% Autonomous AI Team

**Purpose:** Define what AI agents can and cannot do autonomously regarding security.

---

### Autonomous Security Operations

**AI CAN (No Approval Needed):**
- ✅ Run security scans (npm audit, OWASP ZAP, etc.)
- ✅ Detect vulnerabilities in dependencies
- ✅ Apply security patches (non-breaking, patch versions)
- ✅ Update dependencies (minor versions, security fixes)
- ✅ Run automated security tests
- ✅ Monitor security logs
- ✅ Detect suspicious patterns
- ✅ Generate security reports

**AI CAN (With Team Consensus ≥80%):**
- ⚠️ Apply breaking security patches
- ⚠️ Update major dependency versions
- ⚠️ Modify rate limiting rules
- ⚠️ Change CORS configuration
- ⚠️ Update security headers
- ⚠️ Modify input validation rules

**AI CANNOT (Requires HOE Approval):**
- ❌ Modify authentication logic
- ❌ Change authorization rules
- ❌ Modify password hashing algorithms
- ❌ Change JWT secret or signing algorithm
- ❌ Modify security policies
- ❌ Grant elevated permissions
- ❌ Disable security features

**AI CANNOT (Requires External Escalation):**
- 🚨 Respond to active security breaches (escalate immediately)
- 🚨 Handle data breach incidents (escalate to legal/compliance)
- 🚨 Make decisions about user data disclosure
- 🚨 Modify compliance-related security controls

---

### Data Access Control for AI

**AI Can Read:**
- ✅ Application source code
- ✅ Configuration files (non-sensitive)
- ✅ Application logs (sanitized, no PII)
- ✅ Test data (synthetic/anonymized)
- ✅ Public documentation
- ✅ Dependency manifests
- ✅ Build artifacts

**AI Can Read (With Restrictions):**
- ⚠️ Production logs (sanitized, time-limited)
- ⚠️ Database schema (structure only, no data)
- ⚠️ Monitoring metrics (aggregated only)
- ⚠️ Error reports (PII redacted)

**AI Cannot Read:**
- ❌ Production database data (except via approved read-only queries)
- ❌ Secrets/credentials (except via secure vault with audit)
- ❌ PII data (except anonymized/aggregated)
- ❌ Payment information
- ❌ Authentication tokens (except for testing)
- ❌ Private keys
- ❌ Customer communications

**AI Can Write:**
- ✅ Application code (with review)
- ✅ Test data
- ✅ Documentation
- ✅ Configuration (non-security)
- ✅ Logs (application logs)

**AI Cannot Write:**
- ❌ Production database (except via approved migrations)
- ❌ Secrets/credentials
- ❌ User data (except via approved APIs)
- ❌ Security configurations (without approval)
- ❌ Access control lists
- ❌ Audit logs (read-only)

---

### Security Escalation Rules

**Immediate Escalation to HOE:**
- 🚨 Critical vulnerabilities detected (CVSS ≥9.0)
- 🚨 Active security incidents
- 🚨 Suspicious access patterns
- 🚨 Failed security scans blocking deployment
- 🚨 Security policy violations

**Immediate External Escalation:**
- 🚨 Data breach confirmed or suspected
- 🚨 Unauthorized access to production systems
- 🚨 Compliance violations (GDPR, PCI-DSS, etc.)
- 🚨 Legal requests for data
- 🚨 Security incidents affecting customers

**Escalation Process:**
```
1. AI detects security issue
   ↓
2. Assess severity (Low/Medium/High/Critical)
   ↓
3. If Critical: Immediate escalation to HOE + external
   If High: Escalate to HOE
   If Medium: Team consensus
   If Low: Autonomous remediation
   ↓
4. Log incident for learning
   ↓
5. Implement preventive measures
```

---

### Security Decision Authority

| Decision Type | AI Autonomous | Team Consensus | HOE Approval | External |
|---------------|---------------|----------------|--------------|----------|
| Run security scans | ✅ | - | - | - |
| Apply patch updates | ✅ | - | - | - |
| Update dependencies (minor) | ✅ | - | - | - |
| Update dependencies (major) | - | ✅ (≥80%) | - | - |
| Modify rate limiting | - | ✅ (≥80%) | - | - |
| Change auth logic | - | - | ✅ | - |
| Modify security policies | - | - | ✅ | - |
| Respond to breaches | - | - | - | ✅ |
| Handle compliance issues | - | - | - | ✅ |

---

### Security Audit Trail

**All AI Security Actions Must Be Logged:**

```json
{
  "timestamp": "2026-03-03T10:30:00Z",
  "agent": "developer-agent",
  "action": "apply_security_patch",
  "target": "package.json",
  "details": {
    "package": "express",
    "from": "4.17.1",
    "to": "4.17.3",
    "vulnerability": "CVE-2022-24999",
    "severity": "high"
  },
  "approval": "autonomous",
  "outcome": "success"
}
```

**Audit Log Requirements:**
- Immutable (append-only)
- Timestamped
- Agent identified
- Action described
- Approval level recorded
- Outcome tracked
- Retained for compliance period

---

### Security Testing by AI

**AI Can Autonomously:**
- ✅ Run unit tests with security assertions
- ✅ Run integration tests
- ✅ Run SAST (Static Application Security Testing)
- ✅ Run dependency vulnerability scans
- ✅ Run linting with security rules
- ✅ Test input validation
- ✅ Test authentication flows (in test environment)

**AI Requires Approval:**
- ⚠️ Run DAST (Dynamic Application Security Testing) on staging
- ⚠️ Run penetration tests
- ⚠️ Test production-like environments
- ⚠️ Load testing with security focus

**AI Cannot:**
- ❌ Test production systems
- ❌ Attempt to bypass security controls
- ❌ Test with real user credentials
- ❌ Perform social engineering tests

---

### Secrets Management for AI

**AI Access to Secrets:**

**Development Environment:**
- ✅ Can read secrets from `.env.development`
- ✅ Can use test API keys
- ✅ Can generate test secrets

**Staging Environment:**
- ⚠️ Can read secrets via secure vault (with audit)
- ⚠️ Cannot modify secrets
- ⚠️ Access logged and monitored

**Production Environment:**
- ❌ Cannot directly access secrets
- ❌ Cannot modify secrets
- ⚠️ Can request secret rotation (requires HOE approval)

**Secret Rotation:**
```
1. AI detects secret needs rotation (age, compromise, policy)
   ↓
2. AI generates rotation plan
   ↓
3. Requires HOE approval
   ↓
4. If approved: AI executes rotation with zero-downtime
   ↓
5. AI verifies rotation success
   ↓
6. AI logs rotation for audit
```

---

### Security Incident Response

**AI Role in Incidents:**

**Detection Phase:**
- ✅ Monitor for security events
- ✅ Detect anomalies
- ✅ Alert on suspicious patterns
- ✅ Collect initial evidence

**Response Phase:**
- ⚠️ Isolate affected systems (if safe)
- ⚠️ Block malicious IPs (with confidence >90%)
- ❌ Cannot make containment decisions alone
- 🚨 Must escalate to HOE immediately

**Recovery Phase:**
- ⚠️ Apply patches (with approval)
- ⚠️ Restore from backups (with approval)
- ✅ Run verification tests
- ✅ Monitor for recurrence

**Post-Incident:**
- ✅ Generate incident report
- ✅ Identify root cause
- ✅ Propose preventive measures
- ✅ Update security policies (with approval)
- ✅ Learn from incident

---

### Compliance & Regulations

**AI Responsibilities:**
- ✅ Follow security policies automatically
- ✅ Maintain audit trails
- ✅ Implement security controls as specified
- ✅ Report compliance violations
- ❌ Cannot make compliance decisions
- ❌ Cannot modify compliance requirements

**Compliance Escalation:**
- Any compliance concern → Immediate external escalation
- GDPR, PCI-DSS, HIPAA, SOC2 issues → Legal/Compliance team
- Audit findings → HOE + External auditors

---

### Security Best Practices for AI

**Do:**
- ✅ Always use parameterized queries
- ✅ Always validate input
- ✅ Always escape output
- ✅ Always use HTTPS
- ✅ Always log security events
- ✅ Always follow least privilege principle
- ✅ Always encrypt sensitive data
- ✅ Always scan dependencies

**Don't:**
- ❌ Never commit secrets
- ❌ Never bypass security controls
- ❌ Never ignore security warnings
- ❌ Never use deprecated security features
- ❌ Never disable security for convenience
- ❌ Never assume input is safe
- ❌ Never log sensitive data
- ❌ Never use weak cryptography

---

## Summary: AI Security Boundaries

**Autonomous (No Approval):**
- Security scanning and detection
- Patch updates (non-breaking)
- Security testing (dev/test environments)
- Monitoring and alerting

**Team Consensus (≥80%):**
- Breaking security patches
- Major dependency updates
- Security configuration changes

**HOE Approval Required:**
- Authentication/authorization changes
- Security policy modifications
- Production security changes

**External Escalation Required:**
- Data breaches
- Compliance violations
- Legal issues
- Customer-impacting security incidents

**This ensures AI team operates securely while maintaining appropriate human oversight for critical security decisions.**

