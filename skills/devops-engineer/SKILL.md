---
name: infrastructure-automation
description: Infrastructure automation and DevOps practices for autonomous AI team. Covers IaC, CI/CD pipelines, deployment strategies, monitoring, security, and incident response. Use when managing infrastructure, deployments, or ensuring system reliability.
metadata:
  author: dev-team-mode
  version: "3.0"
  category: infrastructure
  lastUpdated: "2026-03-03"
---

# DevOps Engineer - Infrastructure & Automation

## When to Use This Skill

- Infrastructure provisioning and management
- CI/CD pipeline configuration and optimization
- Deployment automation and strategies
- Monitoring and alerting setup
- Security hardening and compliance
- Incident response and troubleshooting
- Performance optimization and scaling
- Cost optimization

## Core Responsibilities

### 1. Infrastructure as Code (IaC)
Manage infrastructure using Terraform, CloudFormation, or CDK with version control and automated provisioning.

### 2. CI/CD Pipelines
Design and maintain automated build, test, and deployment pipelines ensuring fast, reliable releases.

### 3. Monitoring & Observability
Implement comprehensive monitoring, logging, and alerting to ensure system health and quick incident response.

### 4. Security & Compliance
Enforce security best practices, manage secrets, implement access controls, and ensure compliance.

## Infrastructure Checklist

**Before Deployment:**
- [ ] Infrastructure code reviewed and tested
- [ ] Security scan passed (no vulnerabilities)
- [ ] Cost estimation reviewed
- [ ] Backup and rollback plan ready
- [ ] Monitoring and alerts configured

**During Deployment:**
- [ ] Blue-green or canary deployment strategy
- [ ] Health checks passing
- [ ] Logs monitored in real-time
- [ ] Performance metrics tracked

**After Deployment:**
- [ ] Smoke tests passed
- [ ] Monitoring dashboards updated
- [ ] Documentation updated
- [ ] Post-deployment review scheduled

## CI/CD Pipeline Stages

1. **Build** - Compile code, run linters
2. **Test** - Unit, integration, E2E tests
3. **Security Scan** - Vulnerability scanning
4. **Package** - Create deployment artifacts
5. **Deploy** - Deploy to environment
6. **Verify** - Health checks and smoke tests
7. **Monitor** - Track metrics and logs

## Deployment Strategies

**Blue-Green Deployment:**
- Zero downtime
- Instant rollback capability
- Full environment duplication

**Canary Deployment:**
- Gradual rollout (5% → 25% → 50% → 100%)
- Monitor metrics at each stage
- Automatic rollback on errors

**Rolling Deployment:**
- Update instances incrementally
- Maintain service availability
- Lower resource requirements

## Monitoring & Alerting

**Key Metrics:**
- **Application:** Response time, error rate, throughput
- **Infrastructure:** CPU, memory, disk, network
- **Business:** User activity, conversions, revenue

**Alert Levels:**
- **P0 (Critical):** Production down, data loss
- **P1 (High):** Degraded performance, partial outage
- **P2 (Medium):** Non-critical issues
- **P3 (Low):** Informational

## Security Best Practices

- Use IAM roles, never hardcode credentials
- Implement least privilege access
- Enable encryption at rest and in transit
- Regular security scanning and patching
- Secrets management (AWS Secrets Manager, Vault)
- Network segmentation and firewalls
- Audit logging enabled (CloudTrail)

## Incident Response

1. **Detect** - Alerts trigger, issue identified
2. **Assess** - Determine severity and impact
3. **Respond** - Implement fix or rollback
4. **Communicate** - Update stakeholders
5. **Resolve** - Verify fix and restore service
6. **Post-Mortem** - Document lessons learned

## Cost Optimization

- Right-size resources based on actual usage
- Use reserved instances for predictable workloads
- Implement auto-scaling
- Clean up unused resources
- Use spot instances for fault-tolerant workloads
- Optimize storage with lifecycle policies
- Monitor and set budget alerts

## Best Practices

- Automate everything possible
- Infrastructure as code for all resources
- Immutable infrastructure (no manual changes)
- Comprehensive monitoring and logging
- Regular backups and disaster recovery testing
- Security-first mindset
- Document runbooks and procedures
- Continuous improvement

## References

See `references/` folder for:
- Terraform/CloudFormation templates
- CI/CD pipeline examples
- Monitoring dashboard configurations
- Incident response playbooks
- Security hardening guides
- Cost optimization strategies
