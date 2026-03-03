# Infrastructure Automation Skill
## DevOps Engineer

**Version:** 1.0.0  
**Created:** March 3, 2026

---

## 🎯 Purpose

Enable DevOps Engineer to automate infrastructure, manage deployments, ensure system reliability, and optimize operations for the autonomous AI team.

---

## 🧠 Core Competencies

### 1. Infrastructure as Code (IaC)

**What:** Manage infrastructure through code, not manual configuration

**Tools:** Terraform, AWS CDK, CloudFormation

**Best Practices:**
- Version control all infrastructure code
- Use modules for reusability
- Document all resources
- Test infrastructure changes
- Implement state locking

**Example Terraform:**
```hcl
# PostgreSQL RDS instance
resource "aws_db_instance" "game_db" {
  identifier = "mu-game-db"
  engine = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name = "mu_game"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  multi_az = true
  
  tags = {
    Environment = "production"
    ManagedBy = "terraform"
  }
}
```

### 2. CI/CD Pipeline Management

**What:** Automate build, test, and deployment processes

**Pipeline Stages:**
```
Code Push → Build → Test → Security Scan → Deploy → Monitor
```

**GitHub Actions Example:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Check coverage
        run: npm run test:coverage
      
      - name: Security scan
        run: npm audit
  
  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./scripts/deploy.sh
```

### 3. Deployment Strategies

**Blue-Green Deployment:**
```
1. Deploy new version (Green) alongside old (Blue)
2. Run smoke tests on Green
3. Switch traffic to Green
4. Monitor for issues
5. Keep Blue as rollback option
6. Decommission Blue after validation
```

**Canary Deployment:**
```
1. Deploy new version to small subset (5%)
2. Monitor metrics closely
3. Gradually increase traffic (10%, 25%, 50%, 100%)
4. Rollback if issues detected
5. Full rollout if successful
```

**Rolling Deployment:**
```
1. Update instances one at a time
2. Wait for health check
3. Move to next instance
4. Maintain service availability
5. Rollback if any instance fails
```

### 4. Monitoring & Alerting

**Key Metrics to Monitor:**
- Application: Response time, error rate, throughput
- Infrastructure: CPU, memory, disk, network
- Database: Query time, connections, locks
- Business: User actions, conversions, revenue

**Alerting Rules:**
```yaml
# CloudWatch Alarm Example
ErrorRateHigh:
  metric: ErrorRate
  threshold: 5%
  period: 5 minutes
  action: notify-oncall
  severity: high

ResponseTimeSlow:
  metric: ResponseTime
  threshold: 500ms (p95)
  period: 10 minutes
  action: notify-team
  severity: medium
```

### 5. Security & Compliance

**Security Checklist:**
- [ ] No hardcoded secrets
- [ ] Secrets in AWS Secrets Manager
- [ ] IAM least privilege
- [ ] Security groups configured
- [ ] Encryption at rest/transit
- [ ] MFA enabled
- [ ] Regular security scans
- [ ] Vulnerability patching

**Compliance:**
- GDPR: Data privacy, right to deletion
- SOC 2: Security controls, audit logs
- PCI DSS: Payment data security (if applicable)

---

## 🚀 Deployment Procedures

### Pre-Deployment Checklist

```markdown
## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Rollback plan ready
- [ ] Stakeholders notified
- [ ] Monitoring configured
- [ ] Backup created
- [ ] Health checks defined
```

### Deployment Runbook

```markdown
# Deployment: [Application] v[version]

## Pre-Deployment
1. Backup database
2. Run migrations (if needed)
3. Deploy to staging
4. Run smoke tests
5. Verify staging health

## Deployment
1. Deploy to production (blue-green)
2. Run smoke tests
3. Monitor metrics (30 minutes)
4. Verify health checks
5. Switch traffic gradually

## Post-Deployment
1. Monitor error rates
2. Check performance metrics
3. Verify functionality
4. Document any issues
5. Update status

## Rollback Procedure
1. Switch traffic back to old version
2. Rollback database (if needed)
3. Verify service restored
4. Notify team
5. Investigate root cause
```

### Rollback Decision Matrix

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | >5% | Immediate rollback |
| Response time | >2x baseline | Rollback |
| Failed health checks | >10% | Rollback |
| User complaints | >5 in 10 min | Investigate, consider rollback |
| Database errors | Any critical | Immediate rollback |

---

## 📊 Performance Optimization

### Infrastructure Optimization

**Right-Sizing:**
```
1. Monitor resource utilization
2. Identify over/under-provisioned resources
3. Adjust instance sizes
4. Measure cost savings
5. Repeat monthly
```

**Auto-Scaling:**
```yaml
# Auto-scaling configuration
min_instances: 2
max_instances: 10
target_cpu: 70%
scale_up_cooldown: 300s
scale_down_cooldown: 600s
```

**Caching Strategy:**
```
1. Identify frequently accessed data
2. Implement Redis caching
3. Set appropriate TTLs
4. Monitor cache hit rate (target: >80%)
5. Invalidate on updates
```

### Database Optimization

**Query Optimization:**
- Add indexes for frequent queries
- Avoid N+1 queries
- Use connection pooling
- Implement read replicas
- Monitor slow queries

**Connection Pooling:**
```javascript
const pool = new Pool({
  min: 5,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 🔒 Security Best Practices

### Secrets Management

**Never:**
- ❌ Hardcode secrets in code
- ❌ Commit secrets to Git
- ❌ Store secrets in plain text
- ❌ Share secrets via email/chat

**Always:**
- ✅ Use AWS Secrets Manager
- ✅ Rotate secrets regularly
- ✅ Use different secrets per environment
- ✅ Audit secret access

**Example:**
```javascript
// Good: Load from Secrets Manager
const secret = await secretsManager.getSecretValue({
  SecretId: 'prod/database/password'
}).promise();

const dbPassword = JSON.parse(secret.SecretString).password;
```

### Network Security

**Security Groups:**
```hcl
# Allow only necessary traffic
resource "aws_security_group" "app" {
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

---

## 🚨 Incident Response

### Incident Severity Levels

**P0 (Critical):**
- Production down
- Data loss
- Security breach
- Response time: <15 minutes

**P1 (High):**
- Major feature broken
- Performance degradation >50%
- Response time: <1 hour

**P2 (Medium):**
- Minor feature issue
- Performance degradation <50%
- Response time: <4 hours

**P3 (Low):**
- Cosmetic issues
- Minor bugs
- Response time: <24 hours

### Incident Response Process

```
1. Detect: Alert triggered or issue reported
   ↓
2. Assess: Determine severity
   ↓
3. Notify: Alert on-call engineer
   ↓
4. Investigate: Identify root cause
   ↓
5. Mitigate: Implement fix or rollback
   ↓
6. Verify: Confirm service restored
   ↓
7. Document: Write incident report
   ↓
8. Learn: Conduct post-mortem
   ↓
9. Improve: Implement preventive measures
```

### Post-Mortem Template

```markdown
# Incident Post-Mortem: [INC-ID]

**Date:** [YYYY-MM-DD]
**Severity:** [P0/P1/P2]
**Duration:** [X hours]
**Impact:** [Users affected, services down]

## Timeline
- [HH:MM] Incident detected
- [HH:MM] Investigation started
- [HH:MM] Root cause identified
- [HH:MM] Fix deployed
- [HH:MM] Service restored

## Root Cause
[Detailed explanation]

## Resolution
[What was done]

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Prevention
- [Measure 1]
- [Measure 2]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]
```

---

## 💰 Cost Optimization

### Cost Monitoring

**Track:**
- Monthly spending by service
- Cost per user/transaction
- Unused resources
- Reserved instance utilization

**Optimize:**
```
1. Identify top cost drivers
2. Right-size over-provisioned resources
3. Use reserved instances for stable workloads
4. Delete unused resources
5. Implement auto-scaling
6. Use spot instances for non-critical workloads
```

### Cost Optimization Checklist

- [ ] All resources tagged
- [ ] Budget alerts configured
- [ ] Unused resources cleaned up
- [ ] Right-sizing reviewed monthly
- [ ] Reserved instances for stable workloads
- [ ] Auto-scaling enabled
- [ ] Cost anomaly detection active

---

## 🎯 Success Metrics

### Infrastructure Health

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | 99.9% | TBD |
| Deployment frequency | Daily | TBD |
| Deployment success rate | >95% | TBD |
| Mean time to recovery (MTTR) | <30 min | TBD |
| Mean time between failures (MTBF) | >30 days | TBD |

### Performance

| Metric | Target | Current |
|--------|--------|---------|
| API response time (p95) | <200ms | TBD |
| Database query time (p95) | <100ms | TBD |
| Cache hit rate | >80% | TBD |
| Error rate | <1% | TBD |

### Cost Efficiency

| Metric | Target | Current |
|--------|--------|---------|
| Cost per user | <$X | TBD |
| Infrastructure cost | <40% of budget | TBD |
| Unused resources | <5% | TBD |

---

## 🎓 Continuous Improvement

### Weekly Tasks
- Review monitoring dashboards
- Check for security vulnerabilities
- Optimize slow queries
- Clean up unused resources
- Update documentation

### Monthly Tasks
- Review cost reports
- Right-size resources
- Update dependencies
- Conduct security audit
- Review incident reports

### Quarterly Tasks
- Infrastructure capacity planning
- Disaster recovery drill
- Security penetration testing
- Technology evaluation
- Strategic planning

---

**This skill enables you to automate infrastructure, ensure reliability, optimize performance, and support the autonomous AI team's operations.**

**Last Updated:** March 3, 2026  
**Version:** 1.0.0
