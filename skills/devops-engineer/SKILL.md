---
name: devops-engineer
description: CI/CD, infrastructure management, deployment, and monitoring. Use when setting up pipelines, managing infrastructure, or configuring deployments.
metadata:
  author: mu-dai-thien-su-team
  version: "1.0"
  category: operations
---

# DevOps Engineer Workflow

## When to Use This Skill

- Setting up CI/CD pipelines
- Managing infrastructure
- Configuring deployments
- Setting up monitoring and logging
- Security and compliance
- Performance optimization
- Disaster recovery planning

## Core Responsibilities

### 1. CI/CD Pipeline Management
Automate build, test, and deployment processes for fast, reliable releases.

### 2. Infrastructure as Code
Manage infrastructure through version-controlled code for consistency and repeatability.

### 3. Monitoring & Observability
Ensure system health through comprehensive monitoring, logging, and alerting.

### 4. Security & Compliance
Implement security best practices and maintain compliance standards.

## CI/CD Pipeline Checklist

- [ ] Source control integration (Git)
- [ ] Automated builds on commit
- [ ] Unit tests run automatically
- [ ] Integration tests run automatically
- [ ] Code quality checks (linting, formatting)
- [ ] Security scanning (dependencies, secrets)
- [ ] Build artifacts stored
- [ ] Automated deployment to staging
- [ ] Manual approval for production
- [ ] Rollback capability
- [ ] Deployment notifications

## Deployment Strategies

### Blue-Green Deployment
```
1. Deploy new version (Green) alongside current (Blue)
2. Test Green environment thoroughly
3. Switch traffic from Blue to Green
4. Keep Blue running as rollback option
5. Decommission Blue after stability confirmed
```

### Canary Deployment
```
1. Deploy new version to small subset (5%)
2. Monitor metrics closely
3. Gradually increase traffic (10%, 25%, 50%, 100%)
4. Rollback immediately if issues detected
5. Complete rollout when stable
```

### Rolling Deployment
```
1. Update instances one at a time
2. Health check after each update
3. Continue if healthy, rollback if unhealthy
4. Maintain service availability throughout
```

## Security Checklist

### Application Security
- [ ] Secrets in environment variables (not code)
- [ ] No hardcoded credentials
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting implemented

### Infrastructure Security
- [ ] Firewall rules configured
- [ ] SSH key-based authentication only
- [ ] Regular security updates applied
- [ ] Network segmentation
- [ ] Encryption at rest
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Backup strategy implemented
- [ ] Access logs enabled

### CI/CD Security
- [ ] Dependency vulnerability scanning
- [ ] Container image scanning
- [ ] Secret scanning in code
- [ ] Code signing for releases
- [ ] Access control for pipelines

## Monitoring & Alerting

### Metrics to Monitor
- Response time (p50, p95, p99)
- Error rate
- Request throughput
- CPU/Memory usage
- Disk I/O
- Network traffic

### Alert Configuration
- High error rate (> 5% for 5min)
- Slow response time (p95 > 1s for 10min)
- High CPU usage (> 80% for 10min)
- High memory usage (> 90% for 5min)
- Low disk space (< 10%)

## References

See `references/` folder for:
- CI/CD pipeline examples
- Infrastructure templates
- Monitoring dashboards
- Security checklists
