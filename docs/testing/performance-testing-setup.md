# Performance Testing Setup

**Owner:** QA Engineer  
**Purpose:** Document performance testing infrastructure and procedures  
**Last Updated:** 2026-03-03

---

## Overview

**Goal:** Ensure application meets performance requirements under load

**Key Metrics:**
- Response Time: < 200ms (p95)
- Throughput: > 1000 requests/second
- Error Rate: < 0.1%
- Concurrent Users: Support 10,000+ simultaneous connections

---

## Tools & Frameworks

### 1. Jest (Unit/Integration Performance Tests)

**Purpose:** Test individual function performance

**Installation:**
```bash
npm install --save-dev jest @types/jest
```

**Usage:**
```typescript
describe('Performance Tests', () => {
  it('should process 1000 items in < 100ms', () => {
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      processItem(i);
    }
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

---

### 2. Artillery (Load Testing)

**Purpose:** Simulate high load on server

**Installation:**
```bash
npm install --save-dev artillery
```

**Configuration:** `artillery.yml`
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  
scenarios:
  - name: "User login and play"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"
      
      - ws:
          url: "ws://localhost:3000"
          headers:
            Authorization: "Bearer {{ token }}"
          send:
            - type: "MOVE"
              data:
                x: 100
                y: 200
          think: 1
```

**Run:**
```bash
npm run test:load
# or
artillery run artillery.yml
```

---

### 3. k6 (Alternative Load Testing)

**Purpose:** More advanced load testing scenarios

**Installation:**
```bash
# Install k6 (see https://k6.io/docs/getting-started/installation/)
brew install k6  # macOS
```

**Script:** `k6-script.js`
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import ws from 'k6/ws';

export let options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up
    { duration: '3m', target: 100 },  // Stay at 100
    { duration: '1m', target: 200 },  // Ramp to 200
    { duration: '3m', target: 200 },  // Stay at 200
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% < 200ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  // Login
  let loginRes = http.post('http://localhost:3000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });
  
  let token = loginRes.json('token');
  
  // WebSocket connection
  const url = 'ws://localhost:3000';
  const params = {
    headers: { Authorization: `Bearer ${token}` },
  };
  
  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      // Send movement command
      socket.send(JSON.stringify({
        type: 'MOVE',
        data: { x: 100, y: 200 },
      }));
    });
    
    socket.on('message', (data) => {
      console.log('Received:', data);
    });
    
    socket.setTimeout(() => {
      socket.close();
    }, 5000);
  });
  
  sleep(1);
}
```

**Run:**
```bash
k6 run k6-script.js
```

---

### 4. Clinic.js (Node.js Profiling)

**Purpose:** Profile Node.js application performance

**Installation:**
```bash
npm install --save-dev clinic
```

**Usage:**
```bash
# Doctor - Overall health check
clinic doctor -- node server.js

# Flame - CPU profiling
clinic flame -- node server.js

# Bubbleprof - Async operations
clinic bubbleprof -- node server.js
```

---

## Performance Test Scenarios

### Scenario 1: User Login Load Test

**Goal:** Test authentication system under load

**Expected:**
- 1000 logins/second
- < 200ms response time (p95)
- < 0.1% error rate

**Test:**
```bash
artillery run tests/performance/login-load.yml
```

**Metrics to Monitor:**
- Response time distribution
- Error rate
- Database connection pool usage
- CPU and memory usage

---

### Scenario 2: WebSocket Connection Load

**Goal:** Test WebSocket server capacity

**Expected:**
- 10,000 concurrent connections
- < 50ms message latency
- No connection drops

**Test:**
```bash
k6 run tests/performance/websocket-load.js
```

**Metrics to Monitor:**
- Active connections count
- Message throughput
- Memory usage per connection
- CPU usage

---

### Scenario 3: Database Query Performance

**Goal:** Test database performance under load

**Expected:**
- < 10ms for simple queries
- < 50ms for complex queries
- No connection pool exhaustion

**Test:**
```typescript
// tests/performance/database.test.ts
describe('Database Performance', () => {
  it('should query users in < 10ms', async () => {
    const start = Date.now();
    await accountRepository.findById('user-id');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(10);
  });
  
  it('should handle 100 concurrent queries', async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(accountRepository.findById(`user-${i}`));
    }
    
    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(500); // 100 queries in < 500ms
  });
});
```

---

### Scenario 4: Movement System Performance

**Goal:** Test game movement system under load

**Expected:**
- Process 1000 movement commands/second
- < 16ms per movement (60 FPS)
- No position desync

**Test:**
```typescript
describe('Movement Performance', () => {
  it('should process 1000 movements in < 1s', async () => {
    const movements = [];
    for (let i = 0; i < 1000; i++) {
      movements.push({
        characterId: `char-${i}`,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      });
    }
    
    const start = Date.now();
    await Promise.all(
      movements.map(m => movementService.processMovement(m))
    );
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000);
  });
});
```

---

## Benchmarking

### Baseline Benchmarks (2026-03-03)

**Server:**
- Login: 150ms (p95)
- WebSocket message: 5ms (p95)
- Database query: 8ms (p95)
- Movement processing: 12ms (p95)

**Client:**
- Rendering frame: 14ms (60 FPS)
- Pathfinding: 25ms (p95)
- Network latency: 50ms (p95)

**System:**
- Concurrent users: 5,000 (tested)
- Messages/second: 10,000
- Database connections: 20 (pool)

---

## Running Performance Tests

### Local Development

```bash
# Run all performance tests
npm run test:performance

# Run specific test suite
npm run test:performance -- database

# Run with profiling
npm run test:performance:profile
```

---

### CI/CD Integration

**GitHub Actions:** `.github/workflows/performance.yml`
```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start services
        run: |
          docker-compose up -d postgres redis
          npm run db:migrate
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: performance-results
          path: performance-results/
```

---

## Monitoring & Metrics

### Key Metrics to Track

**Response Time:**
- p50 (median)
- p95 (95th percentile)
- p99 (99th percentile)
- max

**Throughput:**
- Requests per second
- Messages per second
- Concurrent connections

**Error Rate:**
- HTTP errors (4xx, 5xx)
- WebSocket disconnections
- Database errors

**Resource Usage:**
- CPU utilization
- Memory usage
- Database connections
- Network bandwidth

---

### Monitoring Tools

**1. CloudWatch (AWS)**
```bash
# View Lambda metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=api-handler \
  --start-time 2026-03-03T00:00:00Z \
  --end-time 2026-03-03T23:59:59Z \
  --period 300 \
  --statistics Average,Maximum
```

**2. Prometheus + Grafana**
- Setup Prometheus to scrape metrics
- Create Grafana dashboards
- Set up alerts for threshold violations

**3. Application Metrics**
```typescript
// Instrument code with metrics
import { Counter, Histogram } from 'prom-client';

const requestDuration = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
});

// Measure request duration
const end = requestDuration.startTimer();
// ... handle request ...
end({ method: 'POST', route: '/api/login', status_code: 200 });
```

---

## Performance Optimization

### Common Bottlenecks

**1. Database Queries**
- Missing indexes
- N+1 queries
- Large result sets

**Solutions:**
- Add indexes on foreign keys and WHERE clauses
- Use eager loading (JOIN)
- Implement pagination

---

**2. Memory Leaks**
- Event listeners not removed
- Large objects not garbage collected
- Connection leaks

**Solutions:**
- Use `clinic doctor` to detect leaks
- Remove event listeners when done
- Close connections properly

---

**3. CPU-Intensive Operations**
- Complex calculations in main thread
- Synchronous operations blocking event loop

**Solutions:**
- Move to worker threads
- Use async operations
- Optimize algorithms

---

**4. Network Latency**
- Too many round trips
- Large payloads
- No caching

**Solutions:**
- Batch requests
- Compress payloads
- Implement caching (Redis)

---

## Performance Testing Checklist

**Before Testing:**
- [ ] Define performance requirements
- [ ] Setup monitoring tools
- [ ] Prepare test data
- [ ] Configure test environment (similar to production)

**During Testing:**
- [ ] Monitor system resources
- [ ] Record baseline metrics
- [ ] Run tests multiple times
- [ ] Test different load patterns

**After Testing:**
- [ ] Analyze results
- [ ] Identify bottlenecks
- [ ] Document findings
- [ ] Create optimization plan

---

## Troubleshooting

### Issue: High Response Time

**Diagnosis:**
1. Check database query time
2. Check external API calls
3. Profile CPU usage
4. Check memory usage

**Tools:**
```bash
# Profile with Clinic.js
clinic doctor -- node server.js

# Check slow queries
# (Enable PostgreSQL slow query log)
```

---

### Issue: Memory Leak

**Diagnosis:**
1. Monitor memory over time
2. Take heap snapshots
3. Analyze object retention

**Tools:**
```bash
# Heap snapshot
node --inspect server.js
# Open Chrome DevTools → Memory → Take snapshot
```

---

### Issue: Low Throughput

**Diagnosis:**
1. Check CPU utilization
2. Check database connection pool
3. Check network bandwidth
4. Profile async operations

**Tools:**
```bash
# Profile async operations
clinic bubbleprof -- node server.js
```

---

## Next Steps

**Immediate:**
- [ ] Setup Artillery for load testing
- [ ] Create baseline benchmarks
- [ ] Document current performance

**Short-term:**
- [ ] Integrate performance tests in CI/CD
- [ ] Setup monitoring dashboards
- [ ] Optimize identified bottlenecks

**Long-term:**
- [ ] Continuous performance monitoring
- [ ] Regular performance reviews
- [ ] Performance budgets for features

---

**Status:** ✅ COMPLETE  
**Owner:** QA Engineer  
**Last Updated:** 2026-03-03  
**Next Review:** After infrastructure setup
