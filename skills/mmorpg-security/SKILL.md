---
name: mmorpg-security
description: Implement comprehensive security for multiplayer online games. Use when implementing anti-cheat systems, server-side validation, bot detection, exploit prevention, data protection, or account security. Prevents cheating, hacking, and protects player data.
metadata:
  author: Kiro AI Team
  version: 1.0.0
  category: security
  tags: [security, anti-cheat, mmorpg, bot-detection, exploit-prevention]
---

# MMORPG Security

## Overview

Implement comprehensive security measures for multiplayer online games, preventing cheating, exploits, and protecting player data.

## When to Use

- Implementing anti-cheat systems
- Adding server-side validation
- Detecting and preventing bots
- Preventing item/gold duplication
- Securing player accounts
- Protecting sensitive data
- Implementing rate limiting
- Validating game actions

## Security Principles

### 1. Never Trust the Client
- All game logic on server
- Validate every client action
- Assume client is compromised
- Server is source of truth

### 2. Defense in Depth
- Multiple layers of security
- Redundant checks
- Fail-safe defaults
- Graceful degradation

### 3. Least Privilege
- Minimal permissions
- Role-based access
- Temporary tokens
- Audit all actions

## Anti-Cheat Measures

### Server-Side Validation

```typescript
function validateAction(action: PlayerAction): ValidationResult {
  // 1. Check if action is possible
  if (!canPerformAction(action)) {
    return { valid: false, reason: 'Action not possible' };
  }
  
  // 2. Check timing (prevent speed hacks)
  if (!isValidTiming(action)) {
    return { valid: false, reason: 'Invalid timing' };
  }
  
  // 3. Check position (prevent teleport)
  if (!isValidPosition(action)) {
    return { valid: false, reason: 'Invalid position' };
  }
  
  // 4. Check resources
  if (!hasRequiredResources(action)) {
    return { valid: false, reason: 'Insufficient resources' };
  }
  
  return { valid: true };
}
```

### Movement Validation

```typescript
function validateMovement(
  oldPos: Position,
  newPos: Position,
  deltaTime: number
): boolean {
  const distance = Math.sqrt(
    Math.pow(newPos.x - oldPos.x, 2) +
    Math.pow(newPos.y - oldPos.y, 2)
  );
  
  const maxSpeed = getCharacterSpeed();
  const maxDistance = maxSpeed * (deltaTime / 1000);
  const tolerance = 1.1; // 10% for network lag
  
  if (distance > maxDistance * tolerance) {
    logSuspiciousActivity('speed_hack', {
      distance,
      maxDistance,
      deltaTime,
    });
    return false;
  }
  
  return true;
}
```

### Combat Validation

```typescript
function validateAttack(
  attacker: Character,
  target: Character,
  damage: number
): boolean {
  // Check range
  const distance = getDistance(attacker, target);
  if (distance > getAttackRange(attacker)) {
    return false;
  }
  
  // Check line of sight
  if (!hasLineOfSight(attacker, target)) {
    return false;
  }
  
  // Validate damage
  const expectedDamage = calculateDamage(attacker, target);
  const tolerance = 0.1;
  
  if (Math.abs(damage - expectedDamage) > expectedDamage * tolerance) {
    logSuspiciousActivity('damage_hack', {
      reported: damage,
      expected: expectedDamage,
    });
    return false;
  }
  
  return true;
}
```

## Rate Limiting

```typescript
interface RateLimits {
  movement: 20,      // per second
  attack: 5,         // per second
  useSkill: 3,       // per second
  useItem: 2,        // per second
  trade: 10,         // per minute
  createCharacter: 5, // per hour
}

class RateLimiter {
  checkLimit(
    characterId: string,
    action: string,
    limit: number,
    windowMs: number
  ): boolean {
    const key = `${characterId}:${action}`;
    const now = Date.now();
    
    let timestamps = this.actions.get(key) || [];
    timestamps = timestamps.filter(t => now - t < windowMs);
    
    if (timestamps.length >= limit) {
      logSuspiciousActivity('rate_limit_exceeded', {
        characterId,
        action,
        count: timestamps.length,
      });
      return false;
    }
    
    timestamps.push(now);
    this.actions.set(key, timestamps);
    return true;
  }
}
```

## Bot Detection

### Behavioral Analysis

```typescript
interface BehaviorMetrics {
  movementVariance: number;      // Bots move too perfectly
  pathSmoothness: number;        // Bots follow perfect paths
  actionTimingVariance: number;  // Bots have consistent timing
  reactionTime: number;          // Bots react too fast
  sessionDuration: number;       // Bots play 24/7
  chatFrequency: number;         // Bots don't chat
}

function calculateBotScore(metrics: BehaviorMetrics): number {
  let score = 0;
  
  if (metrics.movementVariance < 0.1) score += 20;
  if (metrics.pathSmoothness > 0.9) score += 20;
  if (metrics.actionTimingVariance < 0.05) score += 15;
  if (metrics.reactionTime < 100) score += 15; // <100ms superhuman
  if (metrics.sessionDuration > 12 * 3600) score += 15; // >12 hours
  if (metrics.chatFrequency < 0.01) score += 5;
  
  return score; // 0-100, higher = more likely bot
}
```

### Captcha Challenges

```typescript
async function triggerCaptchaChallenge(characterId: string) {
  const challenge = generateCaptcha();
  
  await sendMessage(characterId, {
    type: 'CAPTCHA_CHALLENGE',
    challenge,
    timeout: 60000,
  });
  
  await pauseAutoHunt(characterId);
  
  const response = await waitForCaptchaResponse(characterId, 60000);
  
  if (!response || !verifyCaptcha(challenge, response)) {
    await handleCaptchaFailure(characterId);
  } else {
    await resumeAutoHunt(characterId);
  }
}
```

## Exploit Prevention

### Item Duplication Prevention

```typescript
async function transferItem(
  fromCharacterId: string,
  toCharacterId: string,
  itemId: string
): Promise<boolean> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Lock rows to prevent race conditions
    await client.query(
      'SELECT * FROM inventory WHERE character_id = $1 FOR UPDATE',
      [fromCharacterId]
    );
    
    // Verify item exists
    const item = await client.query(
      'SELECT * FROM inventory WHERE id = $1 AND character_id = $2',
      [itemId, fromCharacterId]
    );
    
    if (item.rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    
    // Remove from sender
    await client.query('DELETE FROM inventory WHERE id = $1', [itemId]);
    
    // Add to receiver
    await client.query(
      'INSERT INTO inventory (character_id, item_type, quantity) VALUES ($1, $2, $3)',
      [toCharacterId, item.rows[0].item_type, item.rows[0].quantity]
    );
    
    // Log transaction
    await client.query(
      'INSERT INTO trade_logs (from_character, to_character, item_id, timestamp) VALUES ($1, $2, $3, NOW())',
      [fromCharacterId, toCharacterId, itemId]
    );
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    return false;
  } finally {
    client.release();
  }
}
```

## Data Protection

### Password Security

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return { valid: false, reason: 'Min 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Need uppercase' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Need lowercase' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Need number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, reason: 'Need special char' };
  }
  return { valid: true };
}
```

### JWT Security

```typescript
import jwt from 'jsonwebtoken';

function generateToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256' }
  );
}

// Token blacklist (Redis)
async function revokeToken(token: string) {
  const payload = jwt.decode(token) as any;
  const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
  await redis.setex(`blacklist:${token}`, expiresIn, '1');
}
```

### Input Sanitization

```typescript
// Always use parameterized queries
// Bad:
const query = `SELECT * FROM users WHERE username = '${username}'`;

// Good:
const query = 'SELECT * FROM users WHERE username = $1';
const result = await db.query(query, [username]);

// XSS Prevention
function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

## Monitoring & Logging

```typescript
async function logSuspiciousActivity(
  type: string,
  details: any,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  await db.query(
    'INSERT INTO suspicious_activities (type, character_id, details, severity) VALUES ($1, $2, $3, $4)',
    [type, details.characterId, JSON.stringify(details), severity]
  );
  
  if (severity === 'high' || severity === 'critical') {
    await sendAlert(details);
  }
}
```

## Security Checklist

### Authentication & Authorization
- [ ] Passwords hashed with bcrypt (cost 12+)
- [ ] JWT tokens with expiration
- [ ] Token blacklist implemented
- [ ] Failed login tracking
- [ ] Account lockout after failures
- [ ] Password reset with time-limited tokens

### Anti-Cheat
- [ ] Server-side validation for all actions
- [ ] Movement validation
- [ ] Combat validation
- [ ] Rate limiting implemented
- [ ] Bot detection active
- [ ] Captcha challenges ready

### Data Protection
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] HTTPS enforced
- [ ] Database encrypted at rest
- [ ] Sensitive data masked in logs
- [ ] GDPR compliance

### Monitoring
- [ ] Suspicious activity logging
- [ ] Audit trail for important actions
- [ ] Real-time alerts for critical issues
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Incident response plan

---

**Provides comprehensive security measures for protecting multiplayer online games.**
