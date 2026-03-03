# Test Infrastructure Documentation

**Owner:** QA Engineer  
**Purpose:** Document testing infrastructure, setup, and best practices  
**Last Updated:** 2026-03-03

---

## Overview

**Testing Strategy:**
- Unit Tests: 80%+ coverage
- Integration Tests: Critical paths
- E2E Tests: User journeys
- Performance Tests: Load and stress testing

**Testing Framework:** Jest  
**Test Runner:** npm test  
**Coverage Tool:** Jest coverage

---

## Test Environment Setup

### Prerequisites

```bash
# Install dependencies
npm install

# Setup test database
createdb muh5_test

# Run migrations
NODE_ENV=test npm run db:migrate

# Seed test data
NODE_ENV=test npm run db:seed
```

### Environment Variables

**`.env.test`**
```bash
NODE_ENV=test
DATABASE_URL=postgresql://localhost:5432/muh5_test
REDIS_URL=redis://localhost:6379/1
JWT_SECRET=test-secret-key
PORT=3001
```

---

## Test Structure

### Directory Layout

```
packages/
├── client/
│   └── src/
│       ├── input/
│       │   ├── InputHandler.ts
│       │   └── __tests__/
│       │       └── InputHandler.test.ts
│       ├── movement/
│       │   └── __tests__/
│       │       └── PositionInterpolator.test.ts
│       └── network/
│           └── __tests__/
│               └── NetworkClient.test.ts
│
└── server/
    └── src/
        ├── config/
        │   └── __tests__/
        │       ├── configuration.test.ts
        │       └── configuration-properties.test.ts
        ├── repositories/
        │   └── __tests__/
        │       ├── account.repository.test.ts
        │       └── character.repository.test.ts
        ├── services/
        │   └── __tests__/
        │       ├── auth.service.test.ts
        │       └── auth.service.property.test.ts
        └── middleware/
            └── __tests__/
                └── auth.middleware.test.ts
```

---

## Jest Configuration

### Root Config (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### Package-Specific Config

**`packages/server/jest.config.js`**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalSetup: '<rootDir>/jest.global-setup.ts',
  globalTeardown: '<rootDir>/jest.global-teardown.ts',
};
```

---

## Test Setup & Teardown

### Global Setup (`jest.global-setup.ts`)

```typescript
import { setupTestDatabase } from './test-utils/database';
import { setupTestRedis } from './test-utils/redis';

export default async function globalSetup() {
  console.log('Setting up test environment...');
  
  // Setup test database
  await setupTestDatabase();
  
  // Setup test Redis
  await setupTestRedis();
  
  console.log('Test environment ready');
}
```

### Global Teardown (`jest.global-teardown.ts`)

```typescript
import { teardownTestDatabase } from './test-utils/database';
import { teardownTestRedis } from './test-utils/redis';

export default async function globalTeardown() {
  console.log('Tearing down test environment...');
  
  await teardownTestDatabase();
  await teardownTestRedis();
  
  console.log('Test environment cleaned up');
}
```

### Per-Test Setup (`jest.setup.ts`)

```typescript
import { cleanDatabase } from './test-utils/database';

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase();
});

afterEach(async () => {
  // Clear mocks
  jest.clearAllMocks();
});
```

---

## Test Utilities

### Database Utilities (`test-utils/database.ts`)

```typescript
import { Pool } from 'pg';

let pool: Pool;

export async function setupTestDatabase() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  // Run migrations
  await runMigrations(pool);
}

export async function cleanDatabase() {
  // Truncate all tables
  await pool.query(`
    TRUNCATE TABLE accounts, characters, items CASCADE;
  `);
}

export async function teardownTestDatabase() {
  await pool.end();
}

export function getTestPool() {
  return pool;
}
```

### Factory Functions (`test-utils/factories.ts`)

```typescript
import { faker } from '@faker-js/faker';

export function createTestAccount(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: 'hashed-password',
    createdAt: new Date(),
    ...overrides,
  };
}

export function createTestCharacter(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    level: 1,
    experience: 0,
    ...overrides,
  };
}
```

### Mock Data (`test-utils/mocks.ts`)

```typescript
export const mockAccount = {
  id: 'test-account-id',
  email: 'test@example.com',
  password: 'hashed-password',
};

export const mockCharacter = {
  id: 'test-character-id',
  name: 'TestCharacter',
  level: 10,
  experience: 5000,
};

export const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Writing Tests

### Unit Test Example

```typescript
// services/__tests__/auth.service.test.ts
import { AuthService } from '../auth.service';
import { AccountRepository } from '../../repositories/account.repository';
import { createTestAccount } from '../../test-utils/factories';

describe('AuthService', () => {
  let authService: AuthService;
  let accountRepository: jest.Mocked<AccountRepository>;
  
  beforeEach(() => {
    accountRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;
    
    authService = new AuthService(accountRepository);
  });
  
  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const account = createTestAccount();
      accountRepository.findByEmail.mockResolvedValue(account);
      
      const result = await authService.login(
        account.email,
        'password123'
      );
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });
    
    it('should throw error for invalid credentials', async () => {
      accountRepository.findByEmail.mockResolvedValue(null);
      
      await expect(
        authService.login('invalid@example.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

---

### Integration Test Example

```typescript
// repositories/__tests__/account.repository.test.ts
import { AccountRepository } from '../account.repository';
import { getTestPool, cleanDatabase } from '../../test-utils/database';
import { createTestAccount } from '../../test-utils/factories';

describe('AccountRepository', () => {
  let repository: AccountRepository;
  
  beforeAll(() => {
    repository = new AccountRepository(getTestPool());
  });
  
  beforeEach(async () => {
    await cleanDatabase();
  });
  
  describe('create', () => {
    it('should create account in database', async () => {
      const accountData = createTestAccount();
      
      const account = await repository.create(accountData);
      
      expect(account.id).toBeDefined();
      expect(account.email).toBe(accountData.email);
      
      // Verify in database
      const found = await repository.findById(account.id);
      expect(found).toEqual(account);
    });
  });
  
  describe('findByEmail', () => {
    it('should find account by email', async () => {
      const accountData = createTestAccount();
      await repository.create(accountData);
      
      const found = await repository.findByEmail(accountData.email);
      
      expect(found).toBeDefined();
      expect(found.email).toBe(accountData.email);
    });
    
    it('should return null for non-existent email', async () => {
      const found = await repository.findByEmail('nonexistent@example.com');
      
      expect(found).toBeNull();
    });
  });
});
```

---

### E2E Test Example

```typescript
// e2e/__tests__/auth-flow.test.ts
import request from 'supertest';
import { app } from '../../app';
import { cleanDatabase } from '../../test-utils/database';

describe('Authentication Flow (E2E)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });
  
  it('should complete full auth flow', async () => {
    // 1. Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
      })
      .expect(201);
    
    expect(registerRes.body).toHaveProperty('token');
    
    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
      })
      .expect(200);
    
    const token = loginRes.body.token;
    
    // 3. Access protected route
    const profileRes = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(profileRes.body.email).toBe('newuser@example.com');
    
    // 4. Logout
    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    // 5. Verify token is blacklisted
    await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
```

---

## Test Data Management

### Seeding Test Data

**`test-utils/seed.ts`**
```typescript
import { getTestPool } from './database';
import { createTestAccount, createTestCharacter } from './factories';

export async function seedTestData() {
  const pool = getTestPool();
  
  // Create test accounts
  const accounts = [];
  for (let i = 0; i < 10; i++) {
    const account = createTestAccount({
      email: `user${i}@example.com`,
    });
    accounts.push(account);
    
    await pool.query(
      'INSERT INTO accounts (id, email, password) VALUES ($1, $2, $3)',
      [account.id, account.email, account.password]
    );
  }
  
  // Create test characters
  for (const account of accounts) {
    const character = createTestCharacter({
      accountId: account.id,
    });
    
    await pool.query(
      'INSERT INTO characters (id, account_id, name, level) VALUES ($1, $2, $3, $4)',
      [character.id, account.id, character.name, character.level]
    );
  }
}
```

---

## Mocking

### Mocking External Services

```typescript
// Mock Redis
jest.mock('../../infrastructure/redis-client', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'https://s3.amazonaws.com/file.jpg' }),
    }),
  })),
}));
```

### Mocking Time

```typescript
describe('Time-sensitive tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-03'));
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('should expire token after 24 hours', () => {
    const token = generateToken();
    
    // Fast-forward 24 hours
    jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    
    expect(isTokenExpired(token)).toBe(true);
  });
});
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.service.test.ts

# Run tests with coverage
npm test -- --coverage

# Run tests in specific package
npm test --workspace=packages/server

# Run only unit tests
npm test -- --testPathPattern=__tests__

# Run only integration tests
npm test -- --testPathPattern=integration

# Run tests matching pattern
npm test -- --testNamePattern="should login"
```

---

### CI/CD Integration

**`.github/workflows/test.yml`**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: muh5_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/muh5_test
      
      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/muh5_test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

---

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

**Configured in `jest.config.js`:**
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/services/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}
```

---

## Debugging Tests

### VS Code Debug Configuration

**`.vscode/launch.json`**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "${fileBasename}",
        "--config",
        "jest.config.js",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Single Test

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand auth.service.test.ts

# Then open chrome://inspect in Chrome
```

---

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good: Descriptive test names
it('should return 401 when token is invalid', () => {});
it('should create character with default stats', () => {});

// ❌ Bad: Vague test names
it('works', () => {});
it('test1', () => {});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```typescript
it('should calculate damage correctly', () => {
  // Arrange
  const attacker = createTestCharacter({ attack: 100 });
  const defender = createTestCharacter({ defense: 50 });
  
  // Act
  const damage = calculateDamage(attacker, defender);
  
  // Assert
  expect(damage).toBe(50);
});
```

### 3. Test Independence

```typescript
// ✅ Good: Each test is independent
describe('AccountRepository', () => {
  beforeEach(async () => {
    await cleanDatabase(); // Clean before each test
  });
  
  it('test 1', () => {});
  it('test 2', () => {});
});

// ❌ Bad: Tests depend on each other
describe('AccountRepository', () => {
  let accountId;
  
  it('should create account', () => {
    accountId = createAccount(); // Test 2 depends on this
  });
  
  it('should find account', () => {
    findAccount(accountId); // Fails if test 1 fails
  });
});
```

### 4. Mock External Dependencies

```typescript
// ✅ Good: Mock external services
jest.mock('../../infrastructure/redis-client');

// ❌ Bad: Real external calls in tests
// (slow, flaky, requires external services)
```

---

## Troubleshooting

### Issue: Tests Timeout

**Solution:**
```typescript
// Increase timeout for specific test
it('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout

// Or globally in jest.config.js
testTimeout: 10000
```

### Issue: Database Connection Errors

**Solution:**
```bash
# Check database is running
pg_isready -h localhost -p 5432

# Check connection string
echo $DATABASE_URL

# Reset test database
dropdb muh5_test && createdb muh5_test
npm run db:migrate
```

### Issue: Flaky Tests

**Common Causes:**
- Race conditions
- Timing issues
- Shared state between tests
- External dependencies

**Solutions:**
- Use `beforeEach` to reset state
- Mock time-dependent code
- Increase timeouts if needed
- Ensure test independence

---

## Next Steps

**Immediate:**
- [ ] Ensure all tests pass
- [ ] Achieve 80%+ coverage
- [ ] Setup CI/CD integration

**Short-term:**
- [ ] Add E2E tests for critical flows
- [ ] Setup test data factories
- [ ] Document test patterns

**Long-term:**
- [ ] Visual regression testing
- [ ] Contract testing for APIs
- [ ] Mutation testing

---

**Status:** ✅ COMPLETE  
**Owner:** QA Engineer  
**Last Updated:** 2026-03-03  
**Next Review:** Monthly
