# Security Testing Checklist
## QA Engineer Ownership

**Created:** March 3, 2026  
**Owner:** QA Engineer  
**Status:** ✅ Implemented

---

## Automated Security Scanning

### CI/CD Pipeline ✅
- [x] npm audit in GitHub Actions
- [x] Fails build on HIGH/CRITICAL vulnerabilities
- [x] Runs on every push and PR
- [x] ESLint security checks

**Location:** `.github/workflows/security-scan.yml`

---

## Manual Security Checks (Code Review)

### 1. Authentication & Authorization ✅

**Check for:**
- [ ] JWT tokens properly validated
- [ ] Token expiration checked
- [ ] Refresh token mechanism secure
- [ ] Password hashing with bcrypt (cost >= 12)
- [ ] No plaintext passwords in logs or responses

**Example:**
```typescript
// ✅ Good
const hashedPassword = await bcrypt.hash(password, 12);

// ❌ Bad
const hashedPassword = await bcrypt.hash(password, 4); // Too weak
```

---

### 2. Input Validation ✅

**Check for:**
- [ ] All user inputs validated
- [ ] Type checking (TypeScript helps)
- [ ] Length limits enforced
- [ ] Format validation (email, username, etc.)
- [ ] Sanitization before database queries

**Example:**
```typescript
// ✅ Good
if (!username || username.length < 3 || username.length > 50) {
  throw new ValidationError('Invalid username');
}

// ❌ Bad
// No validation - accepts any input
```

---

### 3. SQL Injection Prevention ✅

**Check for:**
- [ ] Parameterized queries used
- [ ] No string concatenation in SQL
- [ ] ORM/query builder used correctly
- [ ] User input never directly in SQL

**Example:**
```typescript
// ✅ Good - Parameterized
const user = await db.query(
  'SELECT * FROM accounts WHERE email = $1',
  [email]
);

// ❌ Bad - String concatenation
const user = await db.query(
  `SELECT * FROM accounts WHERE email = '${email}'`
);
```

---

### 4. XSS Prevention ✅

**Check for:**
- [ ] Output encoding/escaping
- [ ] No innerHTML with user data
- [ ] Content Security Policy headers
- [ ] Sanitize user-generated content

**Example:**
```typescript
// ✅ Good
element.textContent = userInput; // Auto-escaped

// ❌ Bad
element.innerHTML = userInput; // XSS risk
```

---

### 5. CSRF Protection ✅

**Check for:**
- [ ] CSRF tokens for state-changing operations
- [ ] SameSite cookie attribute
- [ ] Origin/Referer header validation
- [ ] No GET requests for state changes

---

### 6. Sensitive Data Exposure ✅

**Check for:**
- [ ] No API keys, passwords, secrets in code
- [ ] Environment variables used
- [ ] Sensitive data not in logs
- [ ] Sensitive data not in error messages
- [ ] HTTPS enforced (production)

**Example:**
```typescript
// ✅ Good
const apiKey = process.env.API_KEY;

// ❌ Bad
const apiKey = 'sk_live_abc123xyz'; // Hardcoded secret
```

---

### 7. Security Misconfiguration ✅

**Check for:**
- [ ] Default passwords changed
- [ ] Unnecessary features disabled
- [ ] Error messages don't reveal system details
- [ ] Security headers configured (HSTS, X-Frame-Options, etc.)
- [ ] CORS properly configured

---

### 8. Dependency Vulnerabilities ✅

**Check for:**
- [ ] npm audit passes
- [ ] Dependencies up to date
- [ ] No known vulnerable packages
- [ ] Regular dependency updates

**Command:**
```bash
npm audit
npm audit fix
```

---

## OWASP Top 10 (2021)

### A01: Broken Access Control
- [ ] Authorization checks on all protected resources
- [ ] Users can't access other users' data
- [ ] Role-based access control enforced

### A02: Cryptographic Failures
- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS for data in transit
- [ ] Strong encryption algorithms used
- [ ] No weak hashing (MD5, SHA1)

### A03: Injection
- [ ] Parameterized queries (SQL injection)
- [ ] Input validation (command injection)
- [ ] Output encoding (XSS)

### A04: Insecure Design
- [ ] Threat modeling performed
- [ ] Security requirements defined
- [ ] Secure design patterns used

### A05: Security Misconfiguration
- [ ] Secure defaults
- [ ] Unnecessary features disabled
- [ ] Security headers configured

### A06: Vulnerable Components
- [ ] Dependencies scanned
- [ ] Known vulnerabilities patched
- [ ] Regular updates

### A07: Authentication Failures
- [ ] Strong password policy
- [ ] Multi-factor authentication (future)
- [ ] Session management secure
- [ ] Rate limiting on login

### A08: Software and Data Integrity Failures
- [ ] Code signing (future)
- [ ] Integrity checks
- [ ] Secure CI/CD pipeline

### A09: Security Logging Failures
- [ ] Security events logged
- [ ] Logs protected
- [ ] Monitoring and alerting

### A10: Server-Side Request Forgery (SSRF)
- [ ] URL validation
- [ ] Whitelist allowed domains
- [ ] No user-controlled URLs

---

## Security Testing Process

### For Every PR:

1. **Automated Scan** (CI/CD)
   - npm audit runs automatically
   - ESLint security checks
   - Build fails if HIGH/CRITICAL found

2. **Manual Review** (QA Engineer)
   - Review code changes against this checklist
   - Focus on authentication, input validation, SQL queries
   - Flag any security concerns

3. **Escalation**
   - If unsure, escalate to Tech Lead
   - Document security concerns in PR comments
   - Don't approve until resolved

---

## Common Vulnerabilities Found

### 1. Weak Password Hashing
**Issue:** bcrypt cost factor too low  
**Fix:** Use cost factor >= 12

### 2. SQL Injection Risk
**Issue:** String concatenation in queries  
**Fix:** Use parameterized queries

### 3. Sensitive Data in Logs
**Issue:** Passwords, tokens in console.log  
**Fix:** Remove or mask sensitive data

### 4. Missing Input Validation
**Issue:** No length/format checks  
**Fix:** Add validation before processing

### 5. Hardcoded Secrets
**Issue:** API keys in code  
**Fix:** Use environment variables

---

## Tools & Resources

### Automated Tools
- **npm audit:** Built-in dependency scanner
- **ESLint:** Static code analysis
- **Snyk:** Advanced vulnerability scanning (future)
- **OWASP ZAP:** Penetration testing (future)

### Learning Resources
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Web Security Academy: https://portswigger.net/web-security
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/

### Internal Resources
- [Security Policies](.kiro/steering/security-policies.md)
- [Dev Team Standards](.kiro/steering/dev-team-standards.md)

---

## Metrics

### Track Weekly:
- Number of vulnerabilities found
- Severity distribution (Critical/High/Medium/Low)
- Time to fix
- Vulnerabilities prevented (caught in review)

### Goals:
- Zero HIGH/CRITICAL vulnerabilities in production
- All vulnerabilities fixed within 7 days
- 100% of PRs security reviewed

---

## Quick Reference

### Before Approving PR:
1. ✅ Automated security scan passed?
2. ✅ No hardcoded secrets?
3. ✅ Input validation present?
4. ✅ Parameterized queries used?
5. ✅ No sensitive data in logs?
6. ✅ Authentication/authorization checked?

### When in Doubt:
- Tag @tech-lead for review
- Better safe than sorry
- Security > Speed

---

**Last Updated:** March 3, 2026  
**Next Review:** March 17, 2026
