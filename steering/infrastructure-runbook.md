---
title: Infrastructure Runbook
inclusion: always
description: Critical infrastructure knowledge, deployment procedures, troubleshooting, and operational runbooks
---

# Infrastructure Runbook
## Mu Đại Thiên Sứ H5 Game

**Created:** March 3, 2026  
**Owner:** Tech Lead  
**Purpose:** Critical infrastructure knowledge for team redundancy

---

## 1. System Architecture Overview

### Technology Stack
- **Frontend:** Phaser 3 + TypeScript + Webpack
- **Backend:** Node.js + Express + WebSocket
- **Database:** PostgreSQL 15+
- **Cache:** Redis 4+
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt (cost factor 12)

### Architecture Pattern
```
┌─────────────────────────────────┐
│     Client (Phaser 3)           │  WebGL rendering, game logic
├─────────────────────────────────┤
│     WebSocket Layer             │  Real-time communication
├─────────────────────────────────┤
│     Presentation Layer          │  WebSocket handlers
├─────────────────────────────────┤
│     Application Layer           │  Services (auth, character, combat)
├─────────────────────────────────┤
│     Domain Layer                │  Business entities and rules
├─────────────────────────────────┤
│     Infrastructure Layer        │  Database, Redis, external APIs
└─────────────────────────────────┘
```

### Monorepo Structure
```
muh5/
├── packages/
│   ├── client/          # Frontend game client
│   └── server/          # Backend game server
└── package.json         # Workspace root
```

---

## 2. Development Environment Setup

### Prerequisites
```bash
# Required versions
node >= 18.0.0
npm >= 9.0.0
postgresql >= 15.0
redis >= 4.0
```

### Initial Setup
```bash
# 1. Clone repository
git clone [repository-url]
cd muh5

# 2. Install dependencies (workspace root)
npm install

# 3. Set up PostgreSQL database
createdb mu_game

# 4. Set up environment variables
cd packages/server
cp .env.example .env
# Edit .env with your configuration

# 5. Run database migrations
npm run migrate

# 6. Start Redis
redis-server

# 7. Start development servers
# Terminal 1: Server
npm run dev:server

# Terminal 2: Client
npm run dev:client
```

### Environment Variables

**Server (.env):**
```bash
# Server
PORT=8080

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mu_game
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 3. Database Operations

### Schema Overview

**Tables:**
- `accounts` - User authentication (username, password_hash, email)
- `failed_login_attempts` - Security tracking
- `characters` - Player characters (stats, position, inventory)
- `inventory` - Character items (64 slots)
- `equipment` - Equipped items (weapon, armor, etc.)
- `character_skills` - Learned skills and proficiency
- `character_quests` - Quest progress tracking
- `trade_logs` - Audit log for player trades

**Key Constraints:**
- Username: 3-50 characters, unique
- Email: Valid format, unique
- Character level: 1-400
- Inventory slots: 0-63 (64 total)
- Enhancement level: 0-15

### Migration Commands

```bash
# Check migration status
npm run migrate:status

# Run pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database (rollback all)
npm run migrate:reset
```

### Creating New Migrations

1. Create migration files:
```bash
# In packages/server/src/database/migrations/
# 003_add_guilds.sql
# 003_add_guilds_down.sql
```

2. Write up migration (003_add_guilds.sql):
```sql
CREATE TABLE guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

3. Write down migration (003_add_guilds_down.sql):
```sql
DROP TABLE IF EXISTS guilds;
```

4. Run migration:
```bash
npm run migrate
```

### Database Backup

```bash
# Backup
pg_dump mu_game > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql mu_game < backup_20260303_120000.sql
```

### Common Database Queries

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'mu_game';

-- Find slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## 4. Deployment Procedures

### Build Process

```bash
# Build both client and server
npm run build

# Build individually
npm run build:client
npm run build:server
```

### Production Deployment (Manual - Current)

**Server:**
```bash
cd packages/server

# 1. Build
npm run build

# 2. Run migrations
npm run migrate

# 3. Start server
NODE_ENV=production npm start
```

**Client:**
```bash
cd packages/client

# 1. Build
npm run build

# 2. Deploy dist/ folder to web server
# (nginx, Apache, or static hosting)
```

### Environment-Specific Configuration

**Development:**
- Local PostgreSQL and Redis
- Hot reload enabled
- Debug logging
- CORS permissive

**Staging:**
- Staging database
- Production-like configuration
- Testing environment

**Production:**
- Production database with SSL
- Redis cluster
- Error logging only
- CORS restricted
- Rate limiting enforced

---

## 5. Monitoring & Logging

### Application Logs

**Server logs:**
```bash
# Development
npm run dev:server
# Logs to console

# Production
npm start > logs/server.log 2>&1
```

**Log Levels:**
- ERROR: Critical errors requiring immediate attention
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Debug-level messages (dev only)

### Health Checks

**Server health endpoint:**
```bash
curl http://localhost:8080/health
# Expected: {"status":"ok","timestamp":"2026-03-03T..."}
```

**Database connection:**
```bash
# Check if server can connect to database
npm run migrate:status
```

**Redis connection:**
```bash
redis-cli ping
# Expected: PONG
```

### Performance Monitoring

**Database pool stats:**
```typescript
const stats = db.getPoolStats();
console.log(`Active: ${stats.totalCount}, Idle: ${stats.idleCount}`);
```

**Key Metrics to Monitor:**
- Server response time (target: <200ms p95)
- WebSocket latency (target: <50ms)
- Database query time (target: <100ms)
- Active connections
- Memory usage
- CPU usage

---

## 6. Troubleshooting Guide

### Server Won't Start

**Symptom:** Server crashes on startup

**Possible Causes:**
1. Database connection failed
2. Redis connection failed
3. Port already in use
4. Missing environment variables

**Solutions:**
```bash
# Check database
psql -U postgres -d mu_game -c "SELECT 1"

# Check Redis
redis-cli ping

# Check port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Check environment variables
cat packages/server/.env
```

### Database Migration Fails

**Symptom:** Migration command errors

**Solutions:**
```bash
# Check migration status
npm run migrate:status

# Check database connection
psql -U postgres -d mu_game

# Rollback and retry
npm run migrate:rollback
npm run migrate

# Reset if needed (CAUTION: deletes all data)
npm run migrate:reset
npm run migrate
```

### Client Build Fails

**Symptom:** Webpack build errors

**Solutions:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be >= 18

# Build with verbose output
npm run build -- --verbose
```

### WebSocket Connection Issues

**Symptom:** Client can't connect to server

**Solutions:**
1. Check server is running: `curl http://localhost:8080/health`
2. Check firewall rules
3. Check CORS configuration
4. Check WebSocket URL in client code

### Performance Issues

**Symptom:** Slow response times

**Diagnosis:**
```bash
# Check database slow queries
# See "Common Database Queries" section above

# Check server CPU/memory
top  # Linux/macOS
taskmgr  # Windows

# Check Redis memory
redis-cli info memory
```

**Solutions:**
- Add database indexes
- Optimize queries (avoid N+1)
- Implement caching
- Scale horizontally

---

## 7. Security Procedures

### Password Reset

**Never reset passwords manually in database!**

Use proper password reset flow:
1. User requests reset
2. Generate time-limited token
3. Send reset link
4. User sets new password
5. Hash with bcrypt (cost 12)

### Handling Security Incidents

1. **Identify:** What happened?
2. **Contain:** Stop the breach
3. **Investigate:** How did it happen?
4. **Remediate:** Fix the vulnerability
5. **Document:** Write post-mortem
6. **Notify:** Inform affected users if needed

### Security Checklist

- [ ] All secrets in environment variables
- [ ] Database uses SSL in production
- [ ] JWT secret is strong and rotated
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Parameterized queries (no SQL injection)
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Dependencies regularly updated
- [ ] npm audit passes

---

## 8. Backup & Recovery

### Database Backup Strategy

**Daily backups:**
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump mu_game > "$BACKUP_DIR/mu_game_$DATE.sql"

# Keep last 7 days
find $BACKUP_DIR -name "mu_game_*.sql" -mtime +7 -delete
```

**Backup before migrations:**
```bash
pg_dump mu_game > backup_before_migration.sql
npm run migrate
```

### Disaster Recovery

**Database corruption:**
1. Stop server
2. Restore from latest backup
3. Replay transaction logs if available
4. Verify data integrity
5. Restart server

**Data loss:**
1. Identify scope of loss
2. Restore from backup
3. Communicate with affected users
4. Implement prevention measures

---

## 9. Common Tasks

### Adding a New API Endpoint

1. Create handler in `packages/server/src/presentation/websocket-handlers.ts`
2. Add service method in `packages/server/src/services/`
3. Add repository method if needed
4. Write tests
5. Update documentation

### Adding a New Database Table

1. Create migration files (up and down)
2. Write SQL schema
3. Run migration
4. Update TypeScript types
5. Add repository methods
6. Write tests

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all (careful!)
npm update

# Run tests
npm test

# Run security audit
npm audit
npm audit fix
```

---

## 10. Emergency Contacts

### On-Call Rotation
- **Tech Lead:** Primary contact for architecture/infrastructure
- **Developer:** Backup for application issues
- **QA Engineer:** Backup for testing/quality issues

### Escalation Path
1. On-call engineer
2. Tech Lead
3. Head of Engineering

### Critical Issues (P0)
- Production down
- Data breach
- Data loss
- Security vulnerability

**Response Time:** <30 minutes

---

## 11. Performance Optimization

### Database Optimization

**Indexes:**
- All foreign keys indexed
- Frequently queried columns indexed
- Composite indexes for common query patterns

**Query Optimization:**
```sql
-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM characters WHERE account_id = 'uuid';

-- Avoid N+1 queries
-- Bad: Loop and query
-- Good: Single query with JOIN
```

**Connection Pooling:**
- Min: 5 connections
- Max: 20 connections
- Idle timeout: 30 seconds

### Caching Strategy

**Redis caching:**
- Session data (JWT tokens)
- Frequently accessed game data
- Rate limiting counters
- Leaderboards

**Cache invalidation:**
- Time-based (TTL)
- Event-based (on update)

### Client Optimization

- Asset lazy loading
- Object pooling
- Sprite batching
- Texture atlases

---

## 12. Testing

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# With coverage
npm run test:coverage

# Watch mode (development)
npm test -- --watch
```

### Test Coverage Requirements

- Minimum: 80% overall
- Critical paths: 100%
- New code: Must include tests

### Testing Strategy

- **Unit tests:** Business logic, utilities
- **Integration tests:** API endpoints, database operations
- **Property-based tests:** Complex algorithms (fast-check)
- **E2E tests:** Critical user flows (future)

---

## 13. CI/CD Pipeline

### Current Setup

**Automated checks:**
- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests
- Security scanning (npm audit)

**Manual steps:**
- Build
- Deployment
- Database migrations

### Future Improvements

- Automated deployment
- Staging environment
- Performance testing
- E2E testing
- Automated rollback

---

## 14. Known Issues & Workarounds

### Issue: Database connection pool exhaustion
**Symptom:** "Too many clients" error  
**Workaround:** Restart server, increase pool size  
**Fix:** Implement connection leak detection

### Issue: WebSocket reconnection storms
**Symptom:** Many clients reconnecting simultaneously  
**Workaround:** Implement exponential backoff  
**Status:** Planned for v1.1

---

## 15. Useful Commands Reference

```bash
# Development
npm run dev:server          # Start server with hot reload
npm run dev:client          # Start client dev server
npm test                    # Run all tests
npm run lint                # Run linter

# Database
npm run migrate             # Run migrations
npm run migrate:rollback    # Rollback last migration
npm run migrate:status      # Check migration status

# Build
npm run build               # Build both packages
npm run build:server        # Build server only
npm run build:client        # Build client only

# Production
npm start                   # Start production server

# Maintenance
npm audit                   # Check for vulnerabilities
npm audit fix               # Fix vulnerabilities
npm outdated                # Check for updates
npm update                  # Update dependencies
```

---

**This runbook is a living document. Update it whenever you learn something new or solve a problem!**

**Last Updated:** March 3, 2026  
**Next Review:** March 17, 2026
