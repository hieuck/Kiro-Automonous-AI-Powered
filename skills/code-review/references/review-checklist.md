# Code Review Checklist

## Security ✅

- [ ] No SQL injection vulnerabilities (parameterized queries used)
- [ ] No XSS vulnerabilities (output properly escaped)
- [ ] No exposed secrets or API keys
- [ ] Authentication/authorization properly implemented
- [ ] Input validation on all user inputs
- [ ] Error messages don't leak sensitive information

## Code Quality ✅

- [ ] Naming follows conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] Functions are small (<50 lines)
- [ ] Files are reasonable size (<300 lines)
- [ ] No code duplication (DRY principle)
- [ ] Single Responsibility Principle followed
- [ ] Cyclomatic complexity is low (<10)

## Testing ✅

- [ ] Unit tests exist for new functions
- [ ] Test coverage ≥80%
- [ ] Edge cases are tested
- [ ] Error handling is tested
- [ ] Integration tests for API changes
- [ ] All tests pass

## Performance ✅

- [ ] No N+1 query problems
- [ ] Database indexes exist for queried columns
- [ ] Algorithms are efficient
- [ ] No memory leaks
- [ ] No unnecessary re-renders (frontend)

## Documentation ✅

- [ ] JSDoc/docstrings for public functions
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Complex logic has inline comments

## Architecture ✅

- [ ] Follows project architecture patterns
- [ ] Proper layer separation
- [ ] Dependencies are appropriate
- [ ] No circular dependencies
