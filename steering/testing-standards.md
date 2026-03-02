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
