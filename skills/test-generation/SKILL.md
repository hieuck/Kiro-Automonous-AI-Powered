---
name: test-generation
description: >
  Use when creating tests, writing test cases, or improving test coverage.
  Handles unit tests, integration tests, and property-based tests.
---

# Test Generation

## Workflow

### 1. Analyze Code to Test
- Identify function/class to test
- List all public methods
- Note dependencies and side effects
- Identify edge cases

### 2. Determine Test Type
- **Unit tests:** Pure functions, business logic
- **Integration tests:** API endpoints, database operations
- **Property-based tests:** Complex algorithms, data transformations

### 3. Write Unit Tests

Structure:
```typescript
describe('ClassName or FunctionName', () => {
  describe('methodName', () => {
    it('should do X when Y', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

Cover:
- Happy path
- Edge cases (empty, null, undefined)
- Error cases
- Boundary conditions

### 4. Write Integration Tests

For API endpoints:
```typescript
describe('POST /api/endpoint', () => {
  it('should return 200 with valid data', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(validData);
    
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expected);
  });
  
  it('should return 400 with invalid data', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(invalidData);
    
    expect(response.status).toBe(400);
  });
});
```

### 5. Write Property-Based Tests

For complex logic:
```typescript
import fc from 'fast-check';

describe('complexFunction', () => {
  it('should maintain invariant for all inputs', () => {
    fc.assert(
      fc.property(fc.integer(), (input) => {
        const result = complexFunction(input);
        // Assert invariant
        expect(result).toSatisfy(invariant);
      })
    );
  });
});
```

### 6. Verify Coverage
```bash
npm test -- --coverage
```

Target: ≥80% coverage

### 7. Run Tests
```bash
npm test
```

All tests must pass before committing.

## Test Patterns

### Mock External Dependencies
```typescript
jest.mock('../database');
const mockDb = database as jest.Mocked<typeof database>;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

### Test Async Functions
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});
```

### Test Error Handling
```typescript
it('should throw error for invalid input', () => {
  expect(() => functionUnderTest(invalid)).toThrow(ErrorType);
});
```

## Coverage Requirements

- Unit tests: ≥80% coverage
- Integration tests: All API endpoints
- Property-based tests: Complex algorithms
- Critical paths: 100% coverage

## Rules

- Write tests before fixing bugs (TDD for bugs)
- Test behavior, not implementation
- Keep tests simple and readable
- One assertion per test (when possible)
- Mock external dependencies
- Don't test framework code
- Run tests before committing
