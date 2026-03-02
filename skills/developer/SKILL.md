---
name: developer
description: Clean code implementation, testing, and documentation best practices. Use when writing code, implementing features, or fixing bugs.
metadata:
  author: mu-dai-thien-su-team
  version: "1.0"
  category: development
---

# Developer Workflow

## When to Use This Skill

- Implementing new features
- Fixing bugs
- Writing tests
- Code refactoring
- Documentation updates

## Core Principles

### 1. Clean Code
Write code that is easy to read, understand, and maintain. Follow naming conventions, keep functions small, and avoid duplication.

### 2. Test-Driven Development
Write tests before implementation. Ensure 80%+ coverage for critical paths.

### 3. Documentation
Document complex logic, public APIs, and architectural decisions.

## Implementation Checklist

- [ ] Follow naming conventions (camelCase, PascalCase, kebab-case)
- [ ] Keep functions under 50 lines
- [ ] Maximum 3 levels of nesting
- [ ] Write unit tests (80%+ coverage)
- [ ] Add JSDoc for public functions
- [ ] Handle errors properly
- [ ] Validate all inputs
- [ ] No hardcoded values
- [ ] Use meaningful variable names
- [ ] Follow Single Responsibility Principle

## Code Quality Standards

### Naming Conventions
```javascript
// Variables & Functions: camelCase
const userProfile = getUserData();

// Classes: PascalCase
class UserService {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Files: kebab-case
// user-service.ts, api-client.js
```

### Function Structure
```javascript
// ✅ Good - Single responsibility
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function saveUser(userData) {
  if (!validateEmail(userData.email)) {
    throw new ValidationError('Invalid email');
  }
  return database.save(userData);
}
```

### Error Handling
```javascript
// ✅ Good - Proper error handling
async function fetchUserData(userId) {
  try {
    const user = await database.findById(userId);
    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error });
    throw error;
  }
}
```

## Testing Best Practices

### Test Structure (AAA Pattern)
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };
      
      // Act
      const user = userService.createUser(userData);
      
      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // hashed
    });

    it('should throw error for invalid email', () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!'
      };
      
      // Act & Assert
      expect(() => userService.createUser(userData))
        .toThrow(ValidationError);
    });
  });
});
```

### Test Coverage Goals
- Critical paths: 100%
- Business logic: 90%+
- Overall: 80%+

## Git Workflow

### Commit Message Format
```
[type](scope): subject

feat(auth): add JWT token refresh mechanism
fix(api): handle null response from external service
docs(readme): update installation instructions
test(user): add edge case tests for user creation
refactor(database): optimize query performance
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

## Security Checklist

- [ ] Input validation for all user inputs
- [ ] No SQL injection vulnerabilities
- [ ] Passwords hashed (bcrypt, argon2)
- [ ] No secrets in code
- [ ] Use environment variables
- [ ] Sanitize data before rendering
- [ ] HTTPS for all API calls
- [ ] Proper authentication/authorization

## Performance Considerations

- [ ] Optimize database queries (indexes, limit results)
- [ ] Lazy load heavy resources
- [ ] Cache frequently accessed data
- [ ] Minimize API calls
- [ ] Use pagination for large datasets
- [ ] Optimize images and assets
- [ ] Code splitting for large bundles

## References

See `references/` folder for:
- Clean code examples
- Testing patterns
- Security best practices
- Performance optimization guides
