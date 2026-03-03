---
name: debugging-workflow
description: >
  Use when debugging errors, investigating bugs, or troubleshooting issues.
  Handles systematic debugging with root cause analysis and verification.
---

# Debugging Workflow

## Workflow

### 1. Reproduce the Issue
- Get exact steps to reproduce
- Identify environment (dev/staging/production)
- Collect error messages and stack traces
- Note when the issue started

### 2. Gather Context
- Check recent code changes (git log)
- Review related logs
- Check database state if relevant
- Verify configuration and environment variables

### 3. Form Hypothesis
- Based on error message and context
- Identify likely root cause
- List assumptions to verify

### 4. Test Hypothesis
- Add logging/debugging statements (mark with TODO for removal)
- Run tests to isolate the issue
- Verify assumptions one by one
- Use debugger if needed
- Remove all debug code before committing

### 5. Implement Fix
- Make minimal changes to fix root cause
- Don't fix symptoms, fix the cause
- Add defensive checks if needed
- Update error handling

### 6. Verify Fix
- Reproduce original issue (should be fixed)
- Run full test suite
- Check for regressions
- Test edge cases

### 7. Prevent Recurrence
- Add regression test
- Update documentation
- Add monitoring/alerting if needed
- Share learnings with team

## Common Debugging Techniques

**For Backend Issues:**
- Check server logs
- Verify database queries (use EXPLAIN)
- Test API endpoints with curl/Postman
- Check authentication/authorization

**For Frontend Issues:**
- Check browser console
- Verify network requests (DevTools)
- Check component state
- Test in different browsers

**For Database Issues:**
- Check query performance
- Verify indexes exist
- Check for locks/deadlocks
- Verify data integrity

## Rules

- Always reproduce before fixing
- Fix root cause, not symptoms
- Add tests to prevent regression
- Document the fix and why it works
- Don't commit debug code (console.log, debugger)
