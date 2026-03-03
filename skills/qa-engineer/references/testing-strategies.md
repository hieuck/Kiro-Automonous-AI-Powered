# Comprehensive Testing Strategies

## Testing Pyramid

```
        /\
       /E2E\         10% - End-to-End Tests
      /------\
     /Integration\   20% - Integration Tests
    /------------\
   /  Unit Tests  \  70% - Unit Tests
  /----------------\
```

## Unit Testing

### What to Test
- Individual functions and methods
- Business logic
- Edge cases and error handling
- Data transformations
- Utility functions

### Best Practices

```typescript
describe('calculateDiscount', () => {
  // Arrange - Act - Assert pattern
  
  it('should apply 10% discount for silver tier', () => {
    // Arrange
    const user = { loyaltyTier: 'silver' };
    const amount = 100;
    
    // Act
    const result = calculateDiscount(user, amount);
    
    // Assert
    expect(result).toBe(90);
  });
  
  it('should return original amount for unknown tier', () => {
    const user = { loyaltyTier: 'unknown' };
    const amount = 100;
    
    const result = calculateDiscount(user, amount);
    
    expect(result).toBe(100);
  });
  
  it('should handle zero amount', () => {
    const user = { loyaltyTier: 'gold' };
    const amount = 0;
    
    const result = calculateDiscount(user, amount);
    
    expect(result).toBe(0);
  });
});
```

### Coverage Goals
- Critical paths: 100%
- Business logic: 90%+
- Overall: 80%+

## Integration Testing

### What to Test
- API endpoints
- Database operations
- External service integrations
- Authentication flows
- Data flow between components

### Example

```typescript
describe('POST /api/users', () => {
  it('should create new user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: userData.name,
      email: userData.email
    });
    
    // Verify in database
    const user = await db.users.findByEmail(userData.email);
    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
  });
  
  it('should reject invalid email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'SecurePass123!'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(400);
    
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: 'email',
        message: expect.stringContaining('invalid')
      })
    );
  });
});
```

## E2E Testing

### What to Test
- Critical user journeys
- Complete workflows
- Cross-browser compatibility
- Responsive design
- Accessibility

### Playwright Example

```typescript
test('user can complete checkout process', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  
  // Add item to cart
  await page.goto('/products');
  await page.click('[data-testid="product-1"] button');
  await expect(page.locator('.cart-count')).toHaveText('1');
  
  // Checkout
  await page.click('[data-testid="cart-icon"]');
  await page.click('button:has-text("Checkout")');
  
  // Fill shipping info
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="city"]', 'New York');
  await page.fill('[name="zipCode"]', '10001');
  
  // Complete order
  await page.click('button:has-text("Place Order")');
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.order-number')).toContainText(/ORD-\d+/);
});
```

## Performance Testing

### Load Testing with k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp to 200
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Metrics to Track
- Response time (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- Concurrent users
- Resource utilization

## Security Testing

### Checklist
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication bypass attempts
- [ ] Authorization checks
- [ ] Input validation
- [ ] Rate limiting
- [ ] Sensitive data exposure

### Example Tests

```typescript
describe('Security Tests', () => {
  it('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .get(`/api/users?email=${maliciousInput}`)
      .expect(400);
    
    // Verify database still intact
    const users = await db.users.count();
    expect(users).toBeGreaterThan(0);
  });
  
  it('should require authentication', async () => {
    await request(app)
      .get('/api/profile')
      .expect(401);
  });
  
  it('should enforce authorization', async () => {
    const userToken = await getToken('user');
    
    await request(app)
      .delete('/api/users/123')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
```

## Test Data Management

### Factory Pattern

```typescript
// factories/user.factory.ts
import { faker } from '@faker-js/faker';

export function createUserData(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    ...overrides,
  };
}

export async function createUser(overrides = {}) {
  const data = createUserData(overrides);
  return await db.users.create(data);
}

// Usage in tests
test('user profile', async () => {
  const user = await createUser({ name: 'John Doe' });
  // Test with user
});
```

### Fixtures

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login
    const user = await createUser();
    await page.goto('/login');
    await page.fill('[name="email"]', user.email);
    await page.fill('[name="password"]', user.password);
    await page.click('button[type="submit"]');
    
    // Provide authenticated page
    await use(page);
    
    // Cleanup
    await deleteUser(user.id);
  },
});

// Usage
test('view profile', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile');
  // Test authenticated features
});
```

## Test Stability

### Avoid Flaky Tests

**Use proper waits:**
```typescript
// ❌ Bad: Fixed wait
await page.waitForTimeout(5000);

// ✅ Good: Wait for condition
await page.waitForSelector('.user-profile', { state: 'visible' });
await page.waitForLoadState('networkidle');
```

**Implement retries:**
```typescript
async function retryOperation<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

**Isolate tests:**
```typescript
// Each test should be independent
beforeEach(async () => {
  await db.transaction(async (trx) => {
    // Test runs in transaction
    // Automatically rolls back
  });
});
```

## Continuous Testing

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Best Practices

### Test Naming
```typescript
// ✅ Good: Descriptive
it('should return 400 when email is invalid')
it('should create user with valid data')
it('should prevent duplicate email registration')

// ❌ Bad: Vague
it('works')
it('test user creation')
it('handles errors')
```

### Test Organization
```
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    ├── auth/
    ├── checkout/
    └── profile/
```

### Test Maintenance
- Review and update tests regularly
- Remove obsolete tests
- Refactor duplicated test code
- Keep tests simple and focused
- Document complex test scenarios
