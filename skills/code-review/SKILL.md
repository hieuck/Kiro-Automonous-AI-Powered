---
name: code-review
description: >
  Use when reviewing code changes, pull requests, or diffs.
  Handles security vulnerabilities, code quality issues, test coverage gaps, and performance concerns.
---

# Code Review Skill

## Workflow

### 1. Initial Analysis
- Read the full diff or changed files
- Identify the scope and purpose of changes
- Note which layers are affected (presentation, application, domain, infrastructure)

### 2. Security Review Pass
Check for:
- SQL injection vulnerabilities (use parameterized queries)
- XSS vulnerabilities (proper output escaping)
- Authentication/authorization bypasses
- Exposed secrets or credentials
- Insecure dependencies

### 3. Code Quality Pass
Check for:
- Naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- Function length (<50 lines)
- File length (<300 lines)
- Cyclomatic complexity (<10)
- Code duplication (DRY principle)
- Single Responsibility Principle

### 4. Test Coverage Pass
Verify:
- Unit tests exist for new functions
- Test coverage ≥80%
- Edge cases are tested
- Error handling is tested
- Integration tests for API changes

### 5. Performance Pass
Check for:
- N+1 query problems
- Missing database indexes
- Inefficient algorithms
- Memory leaks
- Unnecessary re-renders (frontend)

### 6. Documentation Pass
Verify:
- JSDoc/docstrings for public functions
- README updated if needed
- API documentation updated
- Complex logic has inline comments

## Output Format

Provide feedback in this structure:

**Security Issues:** [List or "None found"]
**Code Quality:** [List or "Looks good"]
**Test Coverage:** [Coverage % and missing tests]
**Performance:** [Issues or "No concerns"]
**Documentation:** [Missing docs or "Complete"]

**Overall Assessment:** [Approve/Request Changes/Reject]
**Priority Fixes:** [List critical issues that must be fixed]

## Rules

- Always check security first
- Block on security vulnerabilities
- Block on missing tests for critical paths
- Suggest improvements for code quality (don't block)
- Be specific: cite line numbers and provide examples
