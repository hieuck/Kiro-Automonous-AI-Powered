# Performance Optimization Guide

## Caching Strategies

### Browser Caching

```typescript
// Set cache headers
app.use((req, res, next) => {
  if (req.url.startsWith('/static/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});
```

### Redis Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

// Cache-aside pattern
async function getUser(userId: string) {
  // Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - fetch from database
  const user = await db.users.findById(userId);
  
  // Store in cache (TTL: 1 hour)
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
}

// Cache invalidation
async function updateUser(userId: string, data: any) {
  const user = await db.users.update(userId, data);
  
  // Invalidate cache
  await redis.del(`user:${userId}`);
  
  return user;
}
```

### CDN Caching

```typescript
// CloudFront configuration
const distribution = new cloudfront.Distribution(this, 'CDN', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket),
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    compress: true,
  },
  additionalBehaviors: {
    '/api/*': {
      origin: new origins.HttpOrigin('api.example.com'),
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    },
  },
});
```

## Database Query Optimization

### Use Indexes

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Composite index for common query patterns
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### Select Only Needed Columns

```typescript
// ❌ Bad: Select all columns
const users = await db.query('SELECT * FROM users');

// ✅ Good: Select specific columns
const users = await db.query('SELECT id, name, email FROM users');
```

### Batch Operations

```typescript
// ❌ Bad: Multiple individual inserts
for (const user of users) {
  await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', 
    [user.name, user.email]);
}

// ✅ Good: Single batch insert
const values = users.map((u, i) => `($${i*2+1}, $${i*2+2})`).join(',');
const params = users.flatMap(u => [u.name, u.email]);
await db.query(`INSERT INTO users (name, email) VALUES ${values}`, params);
```

### Avoid N+1 Queries

```typescript
// ❌ Bad: N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Good: Single query with join
const users = await User.findAll({
  include: [{ model: Post }]
});
```

## Frontend Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

function DataTable({ items, filter }) {
  // Memoize expensive computation
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);
  
  // Memoize callback
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);
  
  return <Table data={filteredItems} onClick={handleClick} />;
}
```

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>

// Lazy loading images
<img 
  src="image.jpg" 
  loading="lazy" 
  alt="Description"
/>
```

## Profiling Tools

### Node.js Profiling

```bash
# CPU profiling
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# Memory profiling
node --inspect app.js
# Open chrome://inspect in Chrome
```

### Chrome DevTools

```javascript
// Performance marks
performance.mark('start-operation');
// ... operation code ...
performance.mark('end-operation');
performance.measure('operation-duration', 'start-operation', 'end-operation');

// Get measurements
const measures = performance.getEntriesByType('measure');
console.log(measures[0].duration);
```

### Memory Leak Detection

```typescript
// Track memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log({
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`
  });
}, 5000);
```

## Algorithm Optimization

### Time Complexity

```typescript
// ❌ Bad: O(n²)
function findDuplicates(arr: number[]): number[] {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ Good: O(n)
function findDuplicates(arr: number[]): number[] {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    }
    seen.add(num);
  }
  
  return Array.from(duplicates);
}
```

### Debouncing and Throttling

```typescript
// Debounce: Wait for user to stop typing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage
const searchAPI = debounce((query: string) => {
  fetch(`/api/search?q=${query}`);
}, 300);

// Throttle: Limit execution rate
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 100);
```

## Best Practices

### Lazy Loading

```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}
```

### Virtual Scrolling

```typescript
import { FixedSizeList } from 'react-window';

function LargeList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Connection Pooling

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

## Monitoring Performance

### Key Metrics

- **Response Time:** p50, p95, p99 percentiles
- **Throughput:** Requests per second
- **Error Rate:** Percentage of failed requests
- **Resource Usage:** CPU, memory, disk I/O

### Tools

- **Application:** New Relic, Datadog, AppDynamics
- **Infrastructure:** Prometheus, Grafana
- **Frontend:** Lighthouse, WebPageTest
- **Database:** pg_stat_statements, slow query log
