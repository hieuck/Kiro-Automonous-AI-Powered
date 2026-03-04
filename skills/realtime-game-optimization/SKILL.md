---
name: realtime-game-optimization
description: Optimize performance for real-time multiplayer MMORPG. Use when optimizing WebSocket communication, auto-hunt tick systems, database queries, Redis caching, or client-side rendering. Targets <50ms WebSocket latency, <100ms tick processing, and 60 FPS client performance.
metadata:
  author: Kiro AI Team
  version: 1.0.0
  category: performance
  tags: [optimization, performance, websocket, real-time, mmorpg, caching]
---

# Real-Time Game Optimization

## Overview

Optimize performance for real-time multiplayer MMORPG with WebSocket communication and auto-hunt systems.

## When to Use

- Optimizing WebSocket message frequency
- Improving auto-hunt tick performance
- Optimizing database queries
- Implementing Redis caching
- Reducing server load
- Improving client FPS
- Reducing network bandwidth
- Optimizing asset loading

## Performance Targets

### Server
- WebSocket latency: <50ms
- Auto-hunt tick: <100ms per character
- Database query: <50ms (p95)
- API response: <200ms (p95)
- Concurrent connections: 1000+ per server

### Client
- Frame rate: 60 FPS stable
- Initial load: <3 seconds
- Memory usage: <500MB
- Network bandwidth: <100KB/s average

## WebSocket Optimization

### Message Batching

```typescript
// Bad: Individual updates
socket.send({ type: 'POSITION_UPDATE', x, y });
socket.send({ type: 'HP_UPDATE', hp });
socket.send({ type: 'EXP_UPDATE', exp });

// Good: Batch updates
const updates = {
  type: 'STATE_UPDATE',
  position: { x, y },
  stats: { hp, exp },
};
socket.send(updates);
```

### Update Throttling

```typescript
// Max 20 position updates per second
const POSITION_UPDATE_INTERVAL = 50; // ms

let lastPositionUpdate = 0;
function sendPositionUpdate(x: number, y: number) {
  const now = Date.now();
  if (now - lastPositionUpdate < POSITION_UPDATE_INTERVAL) {
    return; // Skip
  }
  
  lastPositionUpdate = now;
  socket.send({ type: 'POSITION_UPDATE', x, y });
}
```

### Delta Compression

```typescript
// Only send changed values
// Before: 500 bytes
{ hp: 1000, mp: 500, x: 100, y: 200, level: 50, ... }

// After: 50 bytes (only HP changed)
{ hp: 1000 }
```

## Auto-Hunt Tick Optimization

### Batch Processing

```typescript
// Bad: One at a time
for (const characterId of activeCharacters) {
  await processAutoHuntTick(characterId);
}

// Good: Batch parallel
const BATCH_SIZE = 100;
for (let i = 0; i < activeCharacters.length; i += BATCH_SIZE) {
  const batch = activeCharacters.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(id => processAutoHuntTick(id)));
}
```

### Tick Rate Optimization

```typescript
// Different rates for different states
const TICK_RATES = {
  IDLE: 2000,        // 2 seconds (slow)
  SEARCHING: 1000,   // 1 second (medium)
  ATTACKING: 500,    // 500ms (fast)
  MOVING: 500,       // 500ms (fast)
};

function getTickRate(state: AutoHuntState): number {
  return TICK_RATES[state] || 1000;
}
```

### Early Exit Optimization

```typescript
async function processAutoHuntTick(characterId: string) {
  // Quick checks first (no DB queries)
  if (!isAutoHuntEnabled(characterId)) return;
  if (isDailyLimitReached(characterId)) return;
  
  // Expensive operations only if needed
  const character = await getCharacter(characterId);
  // ... rest of logic
}
```

## Database Optimization

### Query Optimization

```sql
-- Bad: N+1 query problem
SELECT * FROM characters WHERE id = $1;
SELECT * FROM inventory WHERE character_id = $1;
SELECT * FROM equipment WHERE character_id = $1;

-- Good: Single query with joins
SELECT 
  c.*,
  json_agg(DISTINCT i.*) as inventory,
  json_agg(DISTINCT e.*) as equipment
FROM characters c
LEFT JOIN inventory i ON i.character_id = c.id
LEFT JOIN equipment e ON e.character_id = c.id
WHERE c.id = $1
GROUP BY c.id;
```

### Index Optimization

```sql
-- Critical indexes for auto-hunt
CREATE INDEX idx_characters_auto_hunt 
ON characters(id) 
WHERE auto_hunt_enabled = true;

CREATE INDEX idx_auto_hunt_config_character 
ON auto_hunt_config(character_id);

CREATE INDEX idx_monsters_position 
ON monsters(map_id, x, y);
```

### Connection Pooling

```typescript
const pool = new Pool({
  min: 5,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Redis Caching

### Cache Strategy

```typescript
const CACHE_TTL = {
  CHARACTER_STATE: 60,      // 1 minute
  AUTO_HUNT_CONFIG: 300,    // 5 minutes
  MONSTER_DATA: 3600,       // 1 hour
  MAP_DATA: 86400,          // 24 hours
};

async function getCharacterState(id: string) {
  // Try cache first
  const cached = await redis.get(`character:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss: fetch from DB
  const character = await db.query(
    'SELECT * FROM characters WHERE id = $1',
    [id]
  );
  
  // Store in cache
  await redis.setex(
    `character:${id}`,
    CACHE_TTL.CHARACTER_STATE,
    JSON.stringify(character)
  );
  
  return character;
}
```

### Cache Invalidation

```typescript
async function updateCharacterHP(id: string, hp: number) {
  // Update database
  await db.query('UPDATE characters SET hp = $1 WHERE id = $2', [hp, id]);
  
  // Invalidate cache
  await redis.del(`character:${id}`);
}
```

### Pub/Sub for Real-Time

```typescript
// Publisher
await redis.publish('character:updates', JSON.stringify({
  characterId: 'abc123',
  type: 'HP_UPDATE',
  hp: 500,
}));

// Subscriber
redis.subscribe('character:updates');
redis.on('message', (channel, message) => {
  const update = JSON.parse(message);
  broadcastToClients(update);
});
```

## Client-Side Optimization

### Asset Loading

```typescript
class AssetManager {
  private loaded = new Set<string>();
  
  async loadAsset(key: string, url: string) {
    if (this.loaded.has(key)) return;
    await this.scene.load.image(key, url);
    this.loaded.add(key);
  }
  
  // Preload critical assets
  async preload() {
    await Promise.all([
      this.loadAsset('player', '/assets/player.png'),
      this.loadAsset('ui', '/assets/ui.png'),
    ]);
  }
  
  // Load on-demand
  async loadMonster(type: string) {
    await this.loadAsset(`monster-${type}`, `/assets/monsters/${type}.png`);
  }
}
```

### Object Pooling

```typescript
class DamageNumberPool {
  private pool: Phaser.GameObjects.Text[] = [];
  
  get(): Phaser.GameObjects.Text {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.scene.add.text(0, 0, '', { fontSize: '20px' });
  }
  
  release(obj: Phaser.GameObjects.Text) {
    obj.setVisible(false);
    this.pool.push(obj);
  }
}
```

### Render Optimization

```typescript
// Only render visible entities
class EntityManager {
  update(camera: Phaser.Cameras.Scene2D.Camera) {
    const bounds = camera.worldView;
    
    for (const entity of this.entities) {
      // Cull off-screen entities
      if (!bounds.contains(entity.x, entity.y)) {
        entity.setVisible(false);
        continue;
      }
      
      entity.setVisible(true);
      entity.update();
    }
  }
}
```

### Sprite Batching

```typescript
// Use sprite sheets for batching
this.load.atlas(
  'game-atlas',
  '/assets/game-atlas.png',
  '/assets/game-atlas.json'
);

// All sprites from same atlas are batched
this.add.sprite(x, y, 'game-atlas', 'player');
this.add.sprite(x, y, 'game-atlas', 'monster');
```

## Performance Monitoring

### Server Metrics

```typescript
interface PerformanceMetrics {
  activeConnections: number;
  messagesPerSecond: number;
  averageLatency: number;
  activeAutoHuntSessions: number;
  tickProcessingTime: number;
  queryCount: number;
  averageQueryTime: number;
  cacheHitRate: number;
  cpuUsage: number;
  memoryUsage: number;
}
```

### Logging Slow Operations

```typescript
const startTime = Date.now();
await processAutoHuntTick(characterId);
const duration = Date.now() - startTime;

if (duration > 100) {
  logger.warn('Slow auto-hunt tick', {
    characterId,
    duration,
    state: character.autoHuntState,
  });
}
```

### Client Metrics

```typescript
class PerformanceMonitor {
  private fps: number[] = [];
  
  update() {
    this.fps.push(this.scene.game.loop.actualFps);
    
    if (this.fps.length > 60) {
      this.fps.shift();
    }
    
    const avgFps = this.fps.reduce((a, b) => a + b) / this.fps.length;
    if (avgFps < 30) {
      console.warn('Low FPS:', avgFps);
    }
  }
}
```

## Optimization Checklist

### Server-Side
- [ ] WebSocket messages batched
- [ ] Update throttling implemented
- [ ] Auto-hunt ticks optimized
- [ ] Database queries indexed
- [ ] Connection pooling configured
- [ ] Redis caching implemented
- [ ] Slow query logging enabled
- [ ] Performance metrics tracked

### Client-Side
- [ ] Assets lazy loaded
- [ ] Object pooling implemented
- [ ] Sprite batching used
- [ ] Off-screen culling enabled
- [ ] FPS monitoring active
- [ ] Network usage optimized
- [ ] Memory leaks prevented
- [ ] Performance profiling done

## Common Issues

### Server
- **High CPU:** Too many ticks → Batch processing
- **High Memory:** Memory leaks → Profile and fix
- **Slow DB:** Missing indexes → Add indexes
- **WebSocket Lag:** Too many messages → Batch/throttle

### Client
- **Low FPS:** Too many entities → Culling, pooling
- **High Memory:** Asset leaks → Asset management
- **Slow Loading:** Large assets → Lazy loading
- **Network Lag:** Too many updates → Throttle

## Best Practices

### Do
- ✅ Profile before optimizing
- ✅ Measure impact of changes
- ✅ Optimize hot paths first
- ✅ Use caching strategically
- ✅ Monitor production metrics

### Don't
- ❌ Premature optimization
- ❌ Optimize without measuring
- ❌ Sacrifice code quality
- ❌ Ignore memory usage
- ❌ Forget to test at scale

---

**Provides comprehensive guidance for optimizing real-time multiplayer game performance.**
