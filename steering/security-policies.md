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
