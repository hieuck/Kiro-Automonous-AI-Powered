---
name: performance-optimization
description: >
  Use when optimizing performance, improving speed, or reducing resource usage.
  Handles profiling, bottleneck identification, and optimization strategies.
---

# Performance Optimization

## Workflow

### 1. Measure Baseline
- Profile current performance
- Identify slow operations
- Measure response times
- Check resource usage (CPU, memory, network)

### 2. Identify Bottlenecks
- Use profiling tools
- Check database query times
- Analyze network requests
- Review algorithm complexity

### 3. Prioritize Optimizations
- Focus on biggest bottlenecks first
- Consider impact vs effort
- Target operations in hot paths
- Avoid premature optimization

### 4. Apply Optimizations
- Database: Add indexes, optimize queries
- Backend: Cache results, reduce N+1 queries
- Frontend: Lazy loading, code splitting, memoization
- Algorithm: Use better data structures

### 5. Measure Impact
- Re-run profiling
- Compare before/after metrics
- Verify no regressions
- Document improvements

### 6. Validate
- Run full test suite
- Check for correctness
- Verify edge cases still work
- Monitor in production

## Optimization Strategies

### Database
- Add indexes for frequently queried columns
- Use EXPLAIN ANALYZE to understand query plans
- Avoid SELECT *, fetch only needed columns
- Use connection pooling
- Cache frequently accessed data

### Backend
- Implement caching (Redis)
- Reduce N+1 queries (use JOINs or batch loading)
- Use async operations where possible
- Optimize algorithms (O(n²) → O(n log n))
- Lazy load expensive operations

### Frontend
- Code splitting and lazy loading
- Memoization (React.memo, useMemo)
- Virtual scrolling for large lists
- Image optimization (WebP, lazy loading)
- Debounce/throttle expensive operations

## Performance Targets

- API response time: <200ms (p95)
- Page load time: <3s
- Database queries: <100ms
- WebSocket latency: <50ms

## Rules

- Always measure before and after
- Don't optimize without profiling
- Maintain correctness while optimizing
- Add performance tests for critical paths
- Document optimization rationale
