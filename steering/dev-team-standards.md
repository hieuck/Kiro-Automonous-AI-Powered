---
title: Dev Team Standards
inclusion: always
---

# Chuẩn Mực Phát Triển Team

## Code Quality Standards

### Naming Conventions
- Variables: camelCase (userProfile, isActive)
- Functions: camelCase với động từ (getUserData, validateInput)
- Classes: PascalCase (UserService, DatabaseConnection)
- Constants: UPPER_SNAKE_CASE (MAX_RETRY_COUNT, API_BASE_URL)
- Files: kebab-case (user-service.ts, api-client.js)

### Code Structure
- Mỗi file không quá 300 dòng
- Mỗi function không quá 50 dòng
- Tối đa 3 levels of nesting
- Single Responsibility Principle

### Documentation
- Mọi public function phải có JSDoc/docstring
- Complex logic phải có inline comments
- README.md cho mỗi module/package
- API documentation với examples

## Git Workflow

### Branch Naming
- feature/[ticket-id]-short-description
- bugfix/[ticket-id]-short-description
- hotfix/[ticket-id]-short-description
- release/v[version-number]

### Commit Messages
Format: `[type](scope): message`

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting, missing semicolons
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks

Example: `feat(auth): add JWT token refresh mechanism`

### Pull Request Process
1. Create PR với template đầy đủ
2. Self-review trước khi request review
3. Ít nhất 1 approval từ Tech Lead
4. All CI checks must pass
5. Squash commits khi merge

## Testing Standards

### Coverage Requirements
- Unit tests: minimum 80% coverage
- Integration tests cho critical paths
- E2E tests cho user journeys chính

### Test Structure
```
describe('Feature/Component', () => {
  describe('Method/Function', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Security Guidelines

- Không commit secrets, API keys, passwords
- Sử dụng environment variables
- Input validation cho mọi user input
- Sanitize data trước khi render
- Regular dependency updates
- Security scanning trong CI/CD

## Performance Standards

- API response time < 200ms (p95)
- Page load time < 3s
- Lighthouse score > 90
- Optimize images và assets
- Lazy loading khi phù hợp
- Database query optimization

## Code Review Checklist

### Functionality
- [ ] Code hoạt động đúng như mô tả
- [ ] Edge cases được xử lý
- [ ] Error handling đầy đủ

### Code Quality
- [ ] Follow naming conventions
- [ ] No code duplication
- [ ] Proper abstraction levels
- [ ] SOLID principles

### Testing
- [ ] Unit tests đầy đủ
- [ ] Tests pass locally
- [ ] Coverage không giảm

### Documentation
- [ ] Code comments rõ ràng
- [ ] README updated nếu cần
- [ ] API docs updated

### Security
- [ ] No sensitive data exposed
- [ ] Input validation
- [ ] Authentication/Authorization check
