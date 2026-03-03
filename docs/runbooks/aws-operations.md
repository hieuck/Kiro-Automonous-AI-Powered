# AWS Operations Runbook

**Owner:** Tech Lead  
**Purpose:** Document AWS operations for knowledge transfer and backup  
**Status:** 🚧 IN PROGRESS (Waiting for AWS access)  
**Last Updated:** 2026-03-03

---

## Prerequisites

**Required Access:**
- AWS Console access (IAM user or role)
- AWS CLI installed and configured
- MFA device configured

**Required Knowledge:**
- Basic AWS services (EC2, Lambda, S3, RDS)
- AWS CLI commands
- Infrastructure as Code (Terraform or CloudFormation)

---

## Common Operations

### 1. Check Application Status

**Purpose:** Verify all services are running

```bash
# Check Lambda functions
aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,LastModified]' --output table

# Check API Gateway
aws apigatewayv2 get-apis --query 'Items[*].[Name,ApiEndpoint,CreatedDate]' --output table

# Check RDS instances
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus,Engine]' --output table

# Check S3 buckets
aws s3 ls
```

**Expected Output:** All services should show "available" or "active" status

---

### 2. View Application Logs

**Purpose:** Troubleshoot issues, monitor application

```bash
# View Lambda logs (last 10 minutes)
aws logs tail /aws/lambda/FUNCTION_NAME --follow --since 10m

# Filter for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/FUNCTION_NAME \
  --filter-pattern "ERROR" \
  --start-time $(date -u -d '1 hour ago' +%s)000

# View API Gateway logs
aws logs tail /aws/apigateway/API_ID --follow
```

---

### 3. Deploy Application

**Purpose:** Deploy new version to staging/production

**⚠️ IMPORTANT:** Always deploy to staging first!

```bash
# Step 1: Build application
npm run build

# Step 2: Run tests
npm test

# Step 3: Deploy to staging
# (Specific commands depend on deployment method)

# Step 4: Verify staging deployment
curl https://staging-api.example.com/health

# Step 5: Run smoke tests on staging
npm run test:smoke -- --env=staging

# Step 6: Deploy to production (if staging OK)
# (Specific commands depend on deployment method)

# Step 7: Monitor production logs
aws logs tail /aws/lambda/FUNCTION_NAME --follow
```

---

### 4. Rollback Deployment

**Purpose:** Revert to previous version if issues found

```bash
# For Lambda: Update to previous version
aws lambda update-function-code \
  --function-name FUNCTION_NAME \
  --s3-bucket BUCKET_NAME \
  --s3-key PREVIOUS_VERSION.zip

# For API Gateway: Revert to previous stage
aws apigatewayv2 update-stage \
  --api-id API_ID \
  --stage-name prod \
  --deployment-id PREVIOUS_DEPLOYMENT_ID

# Verify rollback
curl https://api.example.com/health
```

---

### 5. Check Costs

**Purpose:** Monitor AWS spending

```bash
# Get current month costs
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Get cost forecast
aws ce get-cost-forecast \
  --time-period Start=$(date +%Y-%m-%d),End=$(date -d '+30 days' +%Y-%m-%d) \
  --metric BLENDED_COST \
  --granularity MONTHLY
```

---

### 6. Database Operations

**Purpose:** Manage RDS database

```bash
# Create snapshot (backup)
aws rds create-db-snapshot \
  --db-instance-identifier DB_INSTANCE_ID \
  --db-snapshot-identifier backup-$(date +%Y%m%d-%H%M%S)

# List snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier DB_INSTANCE_ID

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier NEW_INSTANCE_ID \
  --db-snapshot-identifier SNAPSHOT_ID
```

---

## Troubleshooting

### Issue: Lambda function timing out

**Symptoms:** 504 Gateway Timeout errors

**Diagnosis:**
```bash
# Check function configuration
aws lambda get-function-configuration --function-name FUNCTION_NAME

# Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=FUNCTION_NAME \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum
```

**Solutions:**
1. Increase timeout: `aws lambda update-function-configuration --function-name FUNCTION_NAME --timeout 30`
2. Increase memory: `aws lambda update-function-configuration --function-name FUNCTION_NAME --memory-size 512`
3. Optimize code (check for slow queries, external API calls)

---

### Issue: High costs

**Symptoms:** AWS bill higher than expected

**Diagnosis:**
```bash
# Identify top cost services
aws ce get-cost-and-usage \
  --time-period Start=$(date -d '7 days ago' +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=SERVICE
```

**Solutions:**
1. Check for unused resources (stopped EC2, old snapshots)
2. Review Lambda invocation count (optimize if too high)
3. Check S3 storage (delete old files, use lifecycle policies)
4. Review RDS instance size (downsize if over-provisioned)

---

### Issue: Database connection errors

**Symptoms:** "Cannot connect to database" errors

**Diagnosis:**
```bash
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier DB_INSTANCE_ID \
  --query 'DBInstances[0].DBInstanceStatus'

# Check security group rules
aws ec2 describe-security-groups \
  --group-ids SECURITY_GROUP_ID
```

**Solutions:**
1. Verify RDS is running: `aws rds start-db-instance --db-instance-identifier DB_INSTANCE_ID`
2. Check security group allows Lambda IP range
3. Verify connection string in environment variables
4. Check RDS parameter group settings

---

## Emergency Contacts

**AWS Support:** (If critical production issue)
- Support Portal: https://console.aws.amazon.com/support/
- Phone: [Support phone number]

**Internal Escalation:**
- Head of Engineering: [Contact info]
- DevOps Team: [Contact info]

---

## Security Best Practices

1. **Never commit AWS credentials** to Git
2. **Use IAM roles** instead of access keys when possible
3. **Enable MFA** for all AWS console access
4. **Use least privilege** - only grant necessary permissions
5. **Rotate credentials** regularly (every 90 days)
6. **Enable CloudTrail** for audit logging
7. **Review IAM policies** quarterly

---

## Next Steps

**When AWS access is granted:**
1. Update this runbook with actual resource names
2. Add specific deployment commands
3. Document infrastructure setup
4. Create Terraform/CloudFormation templates
5. Setup monitoring and alerting

---

**Status:** 🚧 Waiting for AWS access  
**Last Updated:** 2026-03-03  
**Next Review:** After AWS access granted
