---
inclusion: fileMatch
fileMatchPattern: '**/*.test.*,**/*.spec.*,**/tests/**/*,**/__tests__/**/*'
---

# Testing Standards

## Test Structure (AAA Pattern)

```typescript
describe('Feature/Component', () => {
  describe('Method/Function', () => {
    it('should do something when condition', () => {
      // Arrange - Setup
      const input = { email: 'test@example.com' };
      
      // Act - Execute
      const result = validateEmail(input.email);
      
      // Assert - Verify
      expect(result).toBe(true);
    });
  });
});
```

## Coverage Requirements

- **Unit tests:** 80%+ coverage minimum
- **Critical paths:** 100% coverage required
- **Business logic:** 90%+ coverage

## Unit Testing Example

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };
      const mockRepo = {
        save: jest.fn().mockResolvedValue({ id: '123', ...userData })
      };
      const service = new UserService(mockRepo);
      
      // Act
      const result = await service.createUser(userData);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
    });

    it('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!'
      };
      
      await expect(service.createUser(userData))
        .rejects
        .toThrow(ValidationError);
    });
  });
});
```

## Integration Testing

```typescript
describe('POST /api/users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
      .expect(201);
    
    expect(response.body.data.email).toBe('test@example.com');
  });
});
```

## Mocking Best Practices

```typescript
// Mock external dependencies
jest.mock('axios');
axios.get.mockResolvedValue({ data: { id: 1 } });

// Mock database
const mockDb = {
  query: jest.fn().mockResolvedValue([{ id: 1 }])
};
```

## Avoiding Flaky Tests

- Use explicit waits, not sleep
- Clean up test data
- Avoid time-dependent tests
- Mock external dependencies
- Use test isolation


---

## Performance Testing Standards

### Performance Requirements

**Response Time Targets:**
- API endpoints: p95 < 200ms, p99 < 500ms
- Database queries: p95 < 50ms, p99 < 100ms
- Page load: < 3 seconds (3G network)
- Time to Interactive: < 5 seconds

**Throughput Targets:**
- API: 1000 requests/second minimum
- WebSocket: 10,000 concurrent connections
- Database: 5000 queries/second

**Error Rate:**
- < 0.1% under normal load
- < 1% under peak load
- < 5% under stress conditions

### Load Testing with k6

**Basic Load Test:**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>100'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'has data': (r) => r.json('data') !== undefined,
  });
  
  sleep(1);
}
```

**Spike Test:**
```javascript
export const options = {
  stages: [
    { duration: '1m', target: 100 },    // Normal load
    { duration: '30s', target: 1000 },  // Spike!
    { duration: '1m', target: 1000 },   // Sustain spike
    { duration: '30s', target: 100 },   // Back to normal
  ],
};
```

**Stress Test:**
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '5m', target: 300 },
    { duration: '5m', target: 400 },
    // Keep increasing until system breaks
  ],
};
```

### Load Testing with Artillery

**Configuration:**
```yaml
# artillery-config.yml
config:
  target: 'https://api.example.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  
  processor: "./test-processor.js"
  
  defaults:
    headers:
      Authorization: "Bearer {{ $processEnvironment.API_TOKEN }}"
  
scenarios:
  - name: "User Journey"
    flow:
      - get:
          url: "/users/{{ userId }}"
          capture:
            - json: "$.data.id"
              as: "userId"
      
      - think: 2
      
      - post:
          url: "/users/{{ userId }}/actions"
          json:
            action: "login"
            timestamp: "{{ $timestamp }}"
      
      - think: 5
      
      - get:
          url: "/users/{{ userId }}/profile"
          expect:
            - statusCode: 200
            - contentType: json
```

**Run Tests:**
```bash
# Quick test
artillery quick --count 100 --num 10 https://api.example.com

# With config
artillery run artillery-config.yml

# Generate report
artillery run --output report.json artillery-config.yml
artillery report report.json
```

### Performance Metrics

**Key Metrics to Track:**

**Response Time:**
- p50 (median)
- p95 (95th percentile)
- p99 (99th percentile)
- p99.9 (99.9th percentile)
- max

**Throughput:**
- Requests per second (RPS)
- Transactions per second (TPS)
- Data transfer rate (MB/s)

**Errors:**
- Error rate (%)
- Error types distribution
- Failed requests count

**Resource Usage:**
- CPU utilization (%)
- Memory usage (MB)
- Network I/O (MB/s)
- Disk I/O (IOPS)

### Performance Thresholds

**Define in Test Configuration:**
```javascript
// k6
export const options = {
  thresholds: {
    // Response time
    'http_req_duration': [
      'p(95)<200',      // 95% of requests under 200ms
      'p(99)<500',      // 99% of requests under 500ms
    ],
    
    // Error rate
    'http_req_failed': [
      'rate<0.01',      // Error rate under 1%
    ],
    
    // Throughput
    'http_reqs': [
      'rate>100',       // At least 100 RPS
    ],
    
    // Custom metrics
    'api_response_time{endpoint:users}': ['p(95)<150'],
    'api_response_time{endpoint:orders}': ['p(95)<200'],
  },
};
```

### Bottleneck Identification

**Common Bottlenecks:**

**1. Database:**
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check missing indexes
SELECT schemaname, tablename, attname
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
  AND correlation < 0.1;
```

**2. Application:**
```typescript
// Profile with Node.js
node --prof app.js
node --prof-process isolate-*.log > processed.txt

// Memory profiling
node --inspect app.js
// Open chrome://inspect
```

**3. Network:**
```bash
# Check latency
ping api.example.com

# Check bandwidth
iperf3 -c api.example.com

# Check DNS
dig api.example.com
```

### Performance Regression Detection

**Baseline Establishment:**
```bash
# Run baseline test
k6 run --out json=baseline.json load-test.js

# Store baseline metrics
{
  "p95": 180,
  "p99": 450,
  "error_rate": 0.005,
  "throughput": 120
}
```

**Regression Check:**
```javascript
// compare-performance.js
const baseline = require('./baseline.json');
const current = require('./current.json');

function checkRegression(metric, threshold = 0.1) {
  const change = (current[metric] - baseline[metric]) / baseline[metric];
  
  if (change > threshold) {
    console.error(`❌ Regression detected in ${metric}:`);
    console.error(`  Baseline: ${baseline[metric]}`);
    console.error(`  Current: ${current[metric]}`);
    console.error(`  Change: ${(change * 100).toFixed(2)}%`);
    return false;
  }
  
  return true;
}

const passed = [
  checkRegression('p95'),
  checkRegression('p99'),
  checkRegression('error_rate', 0.5), // Allow 50% increase in errors
].every(Boolean);

process.exit(passed ? 0 : 1);
```

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run performance tests
        run: k6 run --out json=results.json load-test.js
      
      - name: Check for regressions
        run: node compare-performance.js
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: results.json
```

### Performance Testing Checklist

**Before Testing:**
- [ ] Define performance requirements
- [ ] Establish baseline metrics
- [ ] Prepare test data (realistic volume)
- [ ] Configure monitoring tools
- [ ] Ensure test environment matches production

**During Testing:**
- [ ] Monitor system resources (CPU, memory, disk, network)
- [ ] Track application metrics (response time, throughput, errors)
- [ ] Log any anomalies or errors
- [ ] Take snapshots at key points
- [ ] Document test conditions

**After Testing:**
- [ ] Analyze results against thresholds
- [ ] Identify bottlenecks
- [ ] Compare with baseline
- [ ] Document findings
- [ ] Create optimization tasks

### Performance Optimization Workflow

**1. Measure:**
```bash
# Run performance test
k6 run load-test.js

# Collect metrics
- Response time: p95 = 450ms (target: 200ms)
- Throughput: 80 RPS (target: 100 RPS)
- Error rate: 2% (target: 0.1%)
```

**2. Analyze:**
```bash
# Profile application
node --prof app.js

# Check database
EXPLAIN ANALYZE SELECT ...

# Monitor resources
top, htop, iostat
```

**3. Optimize:**
```typescript
// Example: Add caching
const cache = new Redis();

async function getUser(id: string) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.users.findById(id);
  await cache.setex(`user:${id}`, 3600, JSON.stringify(user));
  
  return user;
}
```

**4. Verify:**
```bash
# Run test again
k6 run load-test.js

# Compare results
- Response time: p95 = 120ms ✅ (improved 73%)
- Throughput: 150 RPS ✅ (improved 87%)
- Error rate: 0.05% ✅ (improved 97.5%)
```

### Best Practices

**Test Design:**
- Use realistic user scenarios
- Include think time between requests
- Test with production-like data volumes
- Test different load patterns (steady, spike, stress)

**Test Execution:**
- Run tests from multiple locations
- Test during different times of day
- Run tests for sufficient duration (at least 10 minutes)
- Warm up system before measuring

**Results Analysis:**
- Focus on percentiles, not averages
- Look for trends over time
- Correlate with resource usage
- Identify outliers and investigate

**Continuous Testing:**
- Run performance tests in CI/CD
- Track metrics over time
- Set up alerts for regressions
- Review results regularly

---

**Version:** 2.0  
**Last Updated:** 2026-03-03  
**Tools:** k6, Artillery, Node.js profiler
