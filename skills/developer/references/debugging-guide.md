# Debugging Guide

## Systematic Debugging Approach

### 1. Reproduce the Issue
- Get exact steps to reproduce
- Identify conditions (environment, data, timing)
- Verify it's reproducible consistently
- Document reproduction steps

### 2. Isolate the Problem
- Use binary search approach
- Comment out code sections
- Add logging at key points
- Narrow down to specific function/line

### 3. Form Hypothesis
- What could cause this behavior?
- What changed recently?
- What assumptions might be wrong?
- What data could be invalid?

### 4. Test Hypothesis
- Add targeted logging
- Use debugger breakpoints
- Inspect variables and state
- Verify assumptions

### 5. Fix and Verify
- Implement fix
- Test original reproduction steps
- Test edge cases
- Verify no regressions

### 6. Prevent Recurrence
- Add tests for the bug
- Improve error handling
- Add validation
- Document the issue

## Debugging Tools

### Console Debugging

```typescript
// Structured logging
console.log('User login:', { 
  userId, 
  timestamp: Date.now(),
  ip: req.ip 
});

// Conditional breakpoint
if (userId === '123') {
  debugger; // Pause here only for specific user
}

// Performance timing
console.time('database-query');
await db.query(sql);
console.timeEnd('database-query');

// Stack trace
console.trace('Function called from:');

// Table format for arrays
console.table(users);
```

### VS Code Debugger

**launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    }
  ]
}
```

**Breakpoint Types:**
- Regular breakpoint: Click line number
- Conditional breakpoint: Right-click → Add Conditional Breakpoint
- Logpoint: Right-click → Add Logpoint
- Hit count breakpoint: Break after N hits

### Chrome DevTools

**Network Tab:**
- Monitor API requests
- Check request/response headers
- Inspect payload
- Measure timing

**Performance Tab:**
- Record performance profile
- Identify bottlenecks
- Analyze flame graph
- Check memory usage

**Sources Tab:**
- Set breakpoints
- Step through code
- Watch variables
- Call stack inspection

## Log Analysis

### Structured Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

// Usage
logger.info('User logged in', {
  userId: '123',
  ip: '192.168.1.1',
  userAgent: req.headers['user-agent']
});

logger.error('Database connection failed', {
  error: err.message,
  stack: err.stack,
  query: sql
});
```

### Log Searching

```bash
# Search logs with grep
grep "ERROR" app.log | grep "userId:123"

# Count errors by type
grep "ERROR" app.log | cut -d':' -f2 | sort | uniq -c

# Tail logs in real-time
tail -f app.log | grep "ERROR"

# Search with context (3 lines before/after)
grep -C 3 "ERROR" app.log

# Search multiple files
grep -r "ERROR" logs/
```

## Common Bug Patterns

### Race Conditions

```typescript
// ❌ Bug: Race condition
let counter = 0;

async function increment() {
  const current = counter;
  await someAsyncOperation();
  counter = current + 1; // May overwrite other increments
}

// ✅ Fix: Use atomic operations or locks
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
let counter = 0;

async function increment() {
  const release = await mutex.acquire();
  try {
    counter++;
  } finally {
    release();
  }
}
```

### Memory Leaks

```typescript
// ❌ Bug: Event listener not removed
class Component {
  constructor() {
    window.addEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    // Handle resize
  }
}

// ✅ Fix: Remove listener on cleanup
class Component {
  constructor() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }
  
  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    // Handle resize
  }
}
```

### Off-by-One Errors

```typescript
// ❌ Bug: Missing last element
for (let i = 0; i < arr.length - 1; i++) {
  console.log(arr[i]);
}

// ✅ Fix: Include last element
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// Or use for...of
for (const item of arr) {
  console.log(item);
}
```

### Null/Undefined Errors

```typescript
// ❌ Bug: Accessing property of undefined
function getUsername(user) {
  return user.profile.name; // Error if user or profile is undefined
}

// ✅ Fix: Optional chaining
function getUsername(user) {
  return user?.profile?.name ?? 'Anonymous';
}

// Or explicit checks
function getUsername(user) {
  if (!user || !user.profile) {
    return 'Anonymous';
  }
  return user.profile.name;
}
```

## Error Handling

### Try-Catch Best Practices

```typescript
// ❌ Bad: Swallowing errors
try {
  await riskyOperation();
} catch (err) {
  // Silent failure
}

// ✅ Good: Proper error handling
try {
  await riskyOperation();
} catch (err) {
  logger.error('Risky operation failed', {
    error: err.message,
    stack: err.stack,
    context: { userId, operation: 'riskyOperation' }
  });
  
  // Rethrow or handle appropriately
  throw new ApplicationError('Operation failed', { cause: err });
}
```

### Custom Error Classes

```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: any
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

// Usage
throw new ValidationError('Invalid email format', { 
  field: 'email', 
  value: email 
});
```

## Debugging Async Code

### Promise Debugging

```typescript
// Add .catch() to see unhandled rejections
fetchUser(userId)
  .then(user => processUser(user))
  .catch(err => {
    console.error('Error in user flow:', err);
    throw err;
  });

// Use async/await with try-catch
async function handleUser(userId: string) {
  try {
    const user = await fetchUser(userId);
    await processUser(user);
  } catch (err) {
    console.error('Error in user flow:', err);
    throw err;
  }
}
```

### Debugging Callbacks

```typescript
// Add error logging to callbacks
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('File read error:', err);
    return;
  }
  
  console.log('File content:', data.toString());
});
```

## Performance Debugging

### Identify Slow Operations

```typescript
// Measure execution time
async function slowOperation() {
  const start = Date.now();
  
  await someOperation();
  
  const duration = Date.now() - start;
  if (duration > 1000) {
    logger.warn('Slow operation detected', { duration });
  }
}
```

### Profile Database Queries

```sql
-- PostgreSQL: Enable query logging
ALTER DATABASE mydb SET log_statement = 'all';
ALTER DATABASE mydb SET log_duration = on;

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Best Practices

### Debugging Checklist

- [ ] Can you reproduce the bug consistently?
- [ ] Have you checked recent code changes?
- [ ] Have you reviewed error logs?
- [ ] Have you verified input data?
- [ ] Have you checked environment variables?
- [ ] Have you tested in isolation?
- [ ] Have you added logging at key points?
- [ ] Have you used a debugger?

### Prevention

- Write tests for edge cases
- Add input validation
- Use TypeScript for type safety
- Implement proper error handling
- Add comprehensive logging
- Use linters and static analysis
- Code review thoroughly
- Document assumptions

### Documentation

When you fix a bug:
1. Document the root cause
2. Explain the fix
3. Add tests to prevent regression
4. Update relevant documentation
5. Share learnings with team
