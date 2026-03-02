---
title: Mu Đại Thiên Sứ H5 Game - Design Document
type: feature-spec
status: in-progress
version: "1.0"
created: 2026-03-02
updated: 2026-03-02
author: mu-dai-thien-su-team
tags:
  - game-development
  - mmorpg
  - h5-game
  - websocket
  - real-time
---

# Design Document - Mu Đại Thiên Sứ H5 Game

## Overview

Mu Đại Thiên Sứ H5 là một MMORPG HTML5 tái hiện trải nghiệm Mu Online kinh điển. Hệ thống được thiết kế theo kiến trúc client-server với WebSocket cho real-time communication, sử dụng layered architecture để đảm bảo separation of concerns và scalability.

### Core Technologies

**Frontend (Game_Client)**:
- HTML5 Canvas với WebGL rendering
- TypeScript cho type safety
- Phaser 3 game framework
- WebSocket client cho real-time communication

**Backend (Game_Server)**:
- Node.js với TypeScript
- WebSocket server (ws library)
- PostgreSQL cho persistent data
- Redis cho session management và caching

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Game Client (Browser)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Rendering  │  │  Game State  │  │   Input      │  │
│  │   Engine     │  │  Manager     │  │   Handler    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                 │           │
│           └────────────────┴─────────────────┘           │
│                          │                                │
│                    WebSocket Client                       │
└──────────────────────────┼───────────────────────────────┘
                           │
                    WebSocket (WSS)
                           │
┌──────────────────────────┼───────────────────────────────┐
│                    WebSocket Server                       │
│           ┌──────────────┴─────────────────┐             │
│           │                                 │             │
│  ┌────────▼────────┐              ┌────────▼────────┐   │
│  │  Game Logic     │              │  Authentication │   │
│  │  Processor      │              │  Service        │   │
│  └────────┬────────┘              └─────────────────┘   │
│           │                                              │
│  ┌────────▼────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  World Manager  │  │  Combat      │  │  Party    │  │
│  │  (Maps/Zones)   │  │  System      │  │  Manager  │  │
│  └────────┬────────┘  └──────┬───────┘  └─────┬─────┘  │
│           │                   │                 │        │
│           └───────────────────┴─────────────────┘        │
│                          │                                │
│           ┌──────────────┴─────────────────┐             │
│           │                                 │             │
│  ┌────────▼────────┐              ┌────────▼────────┐   │
│  │   PostgreSQL    │              │     Redis       │   │
│  │   (Persistent)  │              │    (Cache)      │   │
│  └─────────────────┘              └─────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## Architecture

### Layered Architecture

#### Presentation Layer (Client)
- **Rendering System**: Canvas/WebGL rendering với Phaser 3
- **UI Components**: Character creation, inventory, chat, party UI
- **Input Handler**: Mouse/keyboard input processing
- **Animation Controller**: Sprite animation và particle effects

#### Application Layer (Server)
- **Game Session Manager**: Quản lý player sessions và connections
- **Command Processor**: Xử lý client commands (move, attack, use skill)
- **Event Dispatcher**: Broadcast game events đến relevant clients
- **Quest Manager**: Quest progression tracking
- **Party Manager**: Party formation và coordination

#### Domain Layer (Server)
- **Character Entity**: Stats, inventory, equipment, skills
- **Monster Entity**: AI behavior, stats, loot tables
- **Combat System**: Damage calculation, skill effects
- **Map Entity**: Terrain, spawn points, portals
- **Item System**: Item types, stats, enhancement

#### Infrastructure Layer (Server)
- **Database Repository**: PostgreSQL data access
- **Cache Service**: Redis caching
- **Configuration Loader**: JSON config parsing
- **WebSocket Manager**: Connection handling

### Communication Protocol

**Message Format**:
```typescript
interface GameMessage {
  type: string;           // Message type (MOVE, ATTACK, CHAT, etc.)
  timestamp: number;      // Client timestamp
  data: any;             // Message-specific payload
  sequenceId?: number;   // For ordered message processing
}

interface ServerResponse {
  type: string;
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}
```

**Message Types**:
- `AUTH`: Authentication request
- `MOVE`: Character movement
- `ATTACK`: Combat action
- `USE_SKILL`: Skill activation
- `CHAT`: Chat message
- `TRADE`: Trade request/action
- `PARTY`: Party operations
- `QUEST`: Quest interactions
- `INVENTORY`: Inventory operations

### State Synchronization

**Client-Side Prediction**:
- Client immediately applies movement/actions
- Server validates và corrects if needed
- Smooth interpolation cho corrections

**Server Authority**:
- Server là source of truth cho all game state
- Client chỉ render state từ server
- Anti-cheat validation server-side

**Update Frequency**:
- Position updates: 10 times/second (100ms)
- Combat updates: Immediate (event-driven)
- Inventory/stats: On change
- World state: 1 time/second (1000ms)

## Components and Interfaces

### Client Components

#### RenderingEngine
```typescript
class RenderingEngine {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  
  initialize(config: RenderConfig): void;
  render(entities: Entity[]): void;
  updateCamera(target: Character): void;
  playAnimation(entity: Entity, animation: string): void;
  createParticleEffect(effect: ParticleConfig): void;
}
```

#### GameStateManager
```typescript
class GameStateManager {
  private localCharacter: Character;
  private nearbyEntities: Map<string, Entity>;
  private worldState: WorldState;
  
  updateLocalCharacter(data: CharacterData): void;
  updateEntity(id: string, data: EntityData): void;
  removeEntity(id: string): void;
  getEntitiesInRange(position: Vector2, range: number): Entity[];
}
```

#### NetworkClient
```typescript
class NetworkClient {
  private socket: WebSocket;
  private messageQueue: GameMessage[];
  
  connect(url: string, token: string): Promise<void>;
  send(message: GameMessage): void;
  onMessage(handler: (message: ServerResponse) => void): void;
  disconnect(): void;
}
```

### Server Components

#### WorldManager
```typescript
class WorldManager {
  private maps: Map<string, GameMap>;
  private spatialIndex: SpatialHashGrid;
  
  loadMap(mapId: string): GameMap;
  getEntitiesNear(position: Vector2, range: number): Entity[];
  moveCharacter(characterId: string, position: Vector2): boolean;
  spawnMonster(monsterId: string, position: Vector2): Monster;
}
```

#### CombatSystem
```typescript
class CombatSystem {
  calculateDamage(attacker: Character, target: Monster, skill?: Skill): number;
  applyDamage(target: Entity, damage: number): CombatResult;
  processSkill(character: Character, skill: Skill, targets: Entity[]): SkillResult;
  checkDeath(entity: Entity): boolean;
  generateLoot(monster: Monster): Item[];
}
```

#### CharacterRepository
```typescript
interface CharacterRepository {
  create(accountId: string, data: CharacterCreateData): Promise<Character>;
  findById(characterId: string): Promise<Character | null>;
  findByAccountId(accountId: string): Promise<Character[]>;
  update(characterId: string, data: Partial<CharacterData>): Promise<void>;
  save(character: Character): Promise<void>;
}
```

#### PartyManager
```typescript
class PartyManager {
  private parties: Map<string, Party>;
  
  createParty(leaderId: string): Party;
  inviteToParty(partyId: string, characterId: string): void;
  acceptInvite(characterId: string, partyId: string): boolean;
  leaveParty(characterId: string): void;
  distributeExp(partyId: string, exp: number): void;
  distributeLoot(partyId: string, item: Item): void;
}
```

#### ConfigurationParser
```typescript
class ConfigurationParser {
  parseMapConfig(json: string): MapConfig;
  parseMonsterConfig(json: string): MonsterConfig;
  parseItemConfig(json: string): ItemConfig;
  parseSkillConfig(json: string): SkillConfig;
  validate(config: any, schema: Schema): ValidationResult;
}
```

## Data Models

### Character
```typescript
interface Character {
  id: string;
  accountId: string;
  name: string;
  class: CharacterClass; // DARK_KNIGHT, DARK_WIZARD, ELF
  level: number;
  experience: number;
  
  // Stats
  stats: {
    strength: number;
    agility: number;
    vitality: number;
    energy: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
  };
  
  // Position
  mapId: string;
  position: { x: number; y: number };
  
  // Inventory
  inventory: InventorySlot[];
  equipment: Equipment;
  gold: number;
  
  // Skills
  skills: Skill[];
  
  // Quests
  activeQuests: Quest[];
  completedQuests: string[];
  
  // Party
  partyId?: string;
  
  // Timestamps
  createdAt: Date;
  lastLogin: Date;
}
```

### Monster
```typescript
interface Monster {
  id: string;
  templateId: string;
  name: string;
  level: number;
  
  stats: {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    attackSpeed: number;
    moveSpeed: number;
  };
  
  position: { x: number; y: number };
  mapId: string;
  
  ai: {
    state: AIState; // IDLE, PATROL, CHASE, ATTACK
    aggroRange: number;
    patrolArea: { x: number; y: number; radius: number };
    target?: string; // Character ID
  };
  
  lootTable: LootEntry[];
  expReward: number;
  
  spawnPoint: { x: number; y: number };
  respawnDelay: number;
}
```

### Item
```typescript
interface Item {
  id: string;
  templateId: string;
  name: string;
  type: ItemType; // WEAPON, ARMOR, HELM, GLOVES, BOOTS, ACCESSORY, CONSUMABLE
  
  requirements: {
    level: number;
    class: CharacterClass[];
    strength?: number;
    agility?: number;
  };
  
  stats?: {
    attack?: number;
    defense?: number;
    attackSpeed?: number;
    // ... other stats
  };
  
  enhancement: {
    level: number;
    maxLevel: number;
  };
  
  options?: ItemOption[]; // Special effects
  
  stackable: boolean;
  maxStack: number;
  quantity: number;
}
```

### Map
```typescript
interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  
  terrain: number[][]; // 2D array, 0 = walkable, 1 = obstacle
  
  spawnPoints: SpawnPoint[];
  portals: Portal[];
  npcs: NPC[];
  
  levelRequirement: number;
  
  config: {
    monsterRespawnDelay: number;
    maxPlayers: number;
    pvpEnabled: boolean;
  };
}
```

### Skill
```typescript
interface Skill {
  id: string;
  name: string;
  class: CharacterClass;
  
  requirements: {
    level: number;
    skillPoints: number;
  };
  
  effects: {
    damageMultiplier: number;
    manaCost: number;
    cooldown: number;
    range: number;
    areaOfEffect?: number;
    duration?: number;
  };
  
  currentLevel: number;
  maxLevel: number;
  proficiency: number;
  
  animation: string;
  particleEffect: string;
}
```

### Party
```typescript
interface Party {
  id: string;
  leaderId: string;
  members: string[]; // Character IDs
  maxMembers: number;
  
  lootDistribution: LootDistributionMode; // FREE_FOR_ALL, ROUND_ROBIN, LEADER
  
  createdAt: Date;
}
```

### Quest
```typescript
interface Quest {
  id: string;
  name: string;
  description: string;
  npcId: string;
  
  requirements: {
    level: number;
    previousQuests?: string[];
  };
  
  objectives: QuestObjective[];
  
  rewards: {
    experience: number;
    gold: number;
    items: Item[];
  };
  
  status: QuestStatus; // AVAILABLE, ACTIVE, COMPLETED
  progress: { [objectiveId: string]: number };
}
```

## Database Schema

### Tables

**accounts**
- id (UUID, PK)
- username (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- email (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)

**characters**
- id (UUID, PK)
- account_id (UUID, FK)
- name (VARCHAR, UNIQUE)
- class (VARCHAR)
- level (INTEGER)
- experience (BIGINT)
- strength (INTEGER)
- agility (INTEGER)
- vitality (INTEGER)
- energy (INTEGER)
- health (INTEGER)
- mana (INTEGER)
- map_id (VARCHAR)
- position_x (FLOAT)
- position_y (FLOAT)
- gold (BIGINT)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)

**inventory**
- id (UUID, PK)
- character_id (UUID, FK)
- slot_index (INTEGER)
- item_template_id (VARCHAR)
- quantity (INTEGER)
- enhancement_level (INTEGER)
- options (JSONB)

**equipment**
- character_id (UUID, PK, FK)
- weapon_id (UUID, FK)
- armor_id (UUID, FK)
- helm_id (UUID, FK)
- gloves_id (UUID, FK)
- boots_id (UUID, FK)
- accessory1_id (UUID, FK)
- accessory2_id (UUID, FK)

**character_skills**
- character_id (UUID, FK)
- skill_id (VARCHAR)
- level (INTEGER)
- proficiency (INTEGER)
- PRIMARY KEY (character_id, skill_id)

**character_quests**
- character_id (UUID, FK)
- quest_id (VARCHAR)
- status (VARCHAR)
- progress (JSONB)
- started_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- PRIMARY KEY (character_id, quest_id)

**trade_logs**
- id (UUID, PK)
- character1_id (UUID, FK)
- character2_id (UUID, FK)
- character1_items (JSONB)
- character2_items (JSONB)
- character1_gold (BIGINT)
- character2_gold (BIGINT)
- timestamp (TIMESTAMP)

### Indexes

- characters(account_id)
- characters(name)
- inventory(character_id)
- character_skills(character_id)
- character_quests(character_id, status)
- trade_logs(character1_id, timestamp)
- trade_logs(character2_id, timestamp)

## Spatial Partitioning

Để optimize entity queries và collision detection, sử dụng **Spatial Hash Grid**:

```typescript
class SpatialHashGrid {
  private cellSize: number = 100; // pixels
  private grid: Map<string, Set<string>>; // cell key -> entity IDs
  
  insert(entityId: string, position: Vector2): void;
  remove(entityId: string, position: Vector2): void;
  query(position: Vector2, range: number): string[];
  
  private getCellKey(position: Vector2): string {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    return `${x},${y}`;
  }
}
```

Mỗi Map có một SpatialHashGrid instance để track entities. Khi entity di chuyển, update grid cells accordingly.


## Anti-Cheat and Validation

### Server-Side Validation

Mọi client action phải được validate server-side trước khi apply:

**Movement Validation**:
```typescript
class MovementValidator {
  validateMove(character: Character, newPosition: Vector2, deltaTime: number): boolean {
    const distance = Vector2.distance(character.position, newPosition);
    const maxDistance = character.stats.moveSpeed * deltaTime;
    
    if (distance > maxDistance * 1.1) { // 10% tolerance
      this.logSuspiciousActivity(character.id, 'SPEED_HACK');
      return false;
    }
    
    if (!this.isWalkable(newPosition)) {
      return false;
    }
    
    return true;
  }
}
```

**Combat Validation**:
```typescript
class CombatValidator {
  validateAttack(attacker: Character, target: Entity, skill?: Skill): boolean {
    // Check range
    const distance = Vector2.distance(attacker.position, target.position);
    const maxRange = skill ? skill.effects.range : attacker.stats.attackRange;
    
    if (distance > maxRange) {
      return false;
    }
    
    // Check cooldown
    if (skill && !this.isCooldownReady(attacker, skill)) {
      return false;
    }
    
    // Check mana
    if (skill && attacker.stats.mana < skill.effects.manaCost) {
      return false;
    }
    
    return true;
  }
}
```

**Action Rate Limiting**:
```typescript
class ActionRateLimiter {
  private actionTimestamps: Map<string, number[]> = new Map();
  
  checkRateLimit(characterId: string, action: string, maxActions: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = this.actionTimestamps.get(`${characterId}:${action}`) || [];
    
    // Remove old timestamps
    const recentTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (recentTimestamps.length >= maxActions) {
      this.logSuspiciousActivity(characterId, 'RATE_LIMIT_EXCEEDED', action);
      return false;
    }
    
    recentTimestamps.push(now);
    this.actionTimestamps.set(`${characterId}:${action}`, recentTimestamps);
    return true;
  }
}
```

### Suspicious Activity Detection

```typescript
interface SuspiciousActivity {
  characterId: string;
  type: string; // SPEED_HACK, TELEPORT, RATE_LIMIT, IMPOSSIBLE_DAMAGE
  timestamp: Date;
  details: any;
}

class AntiCheatSystem {
  private suspiciousActivities: SuspiciousActivity[] = [];
  private thresholds = {
    SPEED_HACK: 3,      // 3 violations = auto-kick
    TELEPORT: 1,        // 1 violation = auto-kick
    RATE_LIMIT: 10,     // 10 violations = temp ban
  };
  
  logActivity(activity: SuspiciousActivity): void {
    this.suspiciousActivities.push(activity);
    
    const recentCount = this.countRecentActivities(
      activity.characterId,
      activity.type,
      300000 // 5 minutes
    );
    
    if (recentCount >= this.thresholds[activity.type]) {
      this.takeAction(activity.characterId, activity.type);
    }
  }
  
  private takeAction(characterId: string, violationType: string): void {
    // Kick player, temp ban, or flag for review
  }
}
```

## Performance Optimization

### Client-Side Optimizations

**Object Pooling**:
```typescript
class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  
  constructor(private factory: () => T, initialSize: number) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }
  
  acquire(): T {
    let obj = this.available.pop();
    if (!obj) {
      obj = this.factory();
    }
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj: T): void {
    this.inUse.delete(obj);
    this.available.push(obj);
  }
}

// Usage
const damageNumberPool = new ObjectPool(() => new DamageNumber(), 50);
const particlePool = new ObjectPool(() => new Particle(), 100);
```

**Asset Loading**:
```typescript
class AssetLoader {
  private loadedAssets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  
  async loadSpriteSheet(key: string, url: string): Promise<void> {
    if (this.loadedAssets.has(key)) {
      return;
    }
    
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }
    
    const promise = this.scene.load.spritesheet(key, url);
    this.loadingPromises.set(key, promise);
    
    await promise;
    this.loadedAssets.set(key, true);
    this.loadingPromises.delete(key);
  }
  
  // Lazy load assets based on map
  async loadMapAssets(mapId: string): Promise<void> {
    const mapConfig = await this.getMapConfig(mapId);
    const assetPromises = mapConfig.requiredAssets.map(asset =>
      this.loadSpriteSheet(asset.key, asset.url)
    );
    await Promise.all(assetPromises);
  }
}
```

**Render Culling**:
```typescript
class RenderCuller {
  getVisibleEntities(camera: Camera, entities: Entity[]): Entity[] {
    const viewport = camera.getViewport();
    const buffer = 100; // pixels outside viewport
    
    return entities.filter(entity => {
      return entity.position.x >= viewport.x - buffer &&
             entity.position.x <= viewport.x + viewport.width + buffer &&
             entity.position.y >= viewport.y - buffer &&
             entity.position.y <= viewport.y + viewport.height + buffer;
    });
  }
}
```

### Server-Side Optimizations

**Database Query Optimization**:
```typescript
class CharacterRepository {
  // Batch load characters for a map
  async findByMapId(mapId: string): Promise<Character[]> {
    return this.db.query(`
      SELECT c.*, 
             json_agg(i.*) as inventory,
             json_agg(s.*) as skills
      FROM characters c
      LEFT JOIN inventory i ON i.character_id = c.id
      LEFT JOIN character_skills s ON s.character_id = c.id
      WHERE c.map_id = $1
      GROUP BY c.id
    `, [mapId]);
  }
  
  // Use prepared statements
  private preparedStatements = {
    updatePosition: null,
    updateStats: null,
  };
  
  async updatePosition(characterId: string, position: Vector2): Promise<void> {
    if (!this.preparedStatements.updatePosition) {
      this.preparedStatements.updatePosition = await this.db.prepare(
        'UPDATE characters SET position_x = $1, position_y = $2 WHERE id = $3'
      );
    }
    
    await this.preparedStatements.updatePosition.execute([
      position.x,
      position.y,
      characterId
    ]);
  }
}
```

**Redis Caching**:
```typescript
class CacheService {
  private redis: Redis;
  
  async getCharacter(characterId: string): Promise<Character | null> {
    // Try cache first
    const cached = await this.redis.get(`character:${characterId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Load from database
    const character = await this.characterRepo.findById(characterId);
    if (character) {
      // Cache for 5 minutes
      await this.redis.setex(
        `character:${characterId}`,
        300,
        JSON.stringify(character)
      );
    }
    
    return character;
  }
  
  async invalidateCharacter(characterId: string): Promise<void> {
    await this.redis.del(`character:${characterId}`);
  }
}
```

**Message Batching**:
```typescript
class MessageBatcher {
  private batches: Map<string, GameMessage[]> = new Map();
  private flushInterval: number = 50; // ms
  
  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }
  
  addMessage(clientId: string, message: GameMessage): void {
    if (!this.batches.has(clientId)) {
      this.batches.set(clientId, []);
    }
    this.batches.get(clientId).push(message);
  }
  
  private flush(): void {
    for (const [clientId, messages] of this.batches.entries()) {
      if (messages.length > 0) {
        this.sendBatch(clientId, messages);
        this.batches.set(clientId, []);
      }
    }
  }
  
  private sendBatch(clientId: string, messages: GameMessage[]): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.send(JSON.stringify({ type: 'BATCH', messages }));
    }
  }
}
```

## Monitoring and Logging

### Structured Logging

```typescript
interface LogEntry {
  timestamp: Date;
  level: LogLevel; // DEBUG, INFO, WARN, ERROR
  service: string;
  message: string;
  context: any;
  correlationId?: string;
}

class Logger {
  log(level: LogLevel, message: string, context?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      service: 'game-server',
      message,
      context: this.sanitizeContext(context),
      correlationId: this.getCurrentCorrelationId(),
    };
    
    console.log(JSON.stringify(entry));
  }
  
  private sanitizeContext(context: any): any {
    // Remove sensitive data (passwords, tokens, etc.)
    if (!context) return context;
    
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret'];
    
    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
```

### Metrics Collection

```typescript
class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  
  increment(metric: string, value: number = 1): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }
  
  gauge(metric: string, value: number): void {
    this.metrics.set(metric, value);
  }
  
  timing(metric: string, duration: number): void {
    // Record timing metric
    this.metrics.set(`${metric}.duration`, duration);
  }
  
  // Export metrics for monitoring system (Prometheus, etc.)
  export(): { [key: string]: number } {
    return Object.fromEntries(this.metrics);
  }
}

// Usage
const metrics = new MetricsCollector();
metrics.increment('combat.attacks');
metrics.increment('combat.damage', damageAmount);
metrics.gauge('players.online', onlineCount);
metrics.timing('database.query', queryDuration);
```



## Monitoring and Logging

### Structured Logging

```typescript
interface LogEntry {
  timestamp: Date;
  level: LogLevel; // DEBUG, INFO, WARN, ERROR
  service: string;
  message: string;
  context: any;
  correlationId?: string;
}

class Logger {
  log(level: LogLevel, message: string, context?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      service: 'game-server',
      message,
      context: this.sanitizeContext(context),
      correlationId: this.getCurrentCorrelationId(),
    };
    
    console.log(JSON.stringify(entry));
  }
  
  private sanitizeContext(context: any): any {
    // Remove sensitive data (passwords, tokens, etc.)
    if (!context) return context;
    
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret'];
    
    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
```

### Metrics Collection

```typescript
class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  
  increment(metric: string, value: number = 1): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }
  
  gauge(metric: string, value: number): void {
    this.metrics.set(metric, value);
  }
  
  timing(metric: string, duration: number): void {
    // Record timing metric
    this.metrics.set(`${metric}.duration`, duration);
  }
  
  // Export metrics for monitoring system (Prometheus, etc.)
  export(): { [key: string]: number } {
    return Object.fromEntries(this.metrics);
  }
}

// Usage
const metrics = new MetricsCollector();
metrics.increment('combat.attacks');
metrics.increment('combat.damage', damageAmount);
metrics.gauge('players.online', onlineCount);
metrics.timing('database.query', queryDuration);
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Character Creation with Valid Name

*For any* valid character name and character class, creating a character should result in a new character with default stats for that class, starting equipment, and placement in the beginner map.

**Validates: Requirements 1.3, 1.5**

### Property 2: Character Name Validation

*For any* character name that is already taken or contains invalid characters, the server should reject the creation request.

**Validates: Requirements 1.4**

### Property 3: Movement Validation

*For any* movement request, if the destination position is invalid (out of bounds or obstructed), the server should reject the movement.

**Validates: Requirements 2.4**


### Property 4: Collision Detection

*For any* character position and obstacle, when the character reaches the obstacle, movement should stop and the character should not pass through.

**Validates: Requirements 2.3**

### Property 5: Damage Calculation Consistency

*For any* character stats, equipment, and monster defense values, the damage calculation should produce consistent results for the same inputs.

**Validates: Requirements 3.2**

### Property 6: Monster Death and Rewards

*For any* monster, when its health reaches zero, it should be removed from the world and experience points should be awarded to the attacking character.

**Validates: Requirements 3.4**

### Property 7: Character Death

*For any* character, when its health reaches zero, the death and respawn mechanics should be triggered.

**Validates: Requirements 3.5**

### Property 8: Loot Generation

*For any* defeated monster, loot generation should follow the monster's drop rate table.

**Validates: Requirements 3.7**

### Property 9: Experience Accumulation

*For any* character and experience point gain, the total experience should accumulate correctly and trigger level up when threshold is reached.

**Validates: Requirements 4.1, 4.2**

### Property 10: Level Up Stat Increases

*For any* character that levels up, base stats (Strength, Agility, Vitality, Energy) should increase and stat points should be granted.

**Validates: Requirements 4.3, 4.5**

### Property 11: Skill Unlocking

*For any* character that reaches a skill level threshold, the appropriate skills for that class should be unlocked.

**Validates: Requirements 4.6, 6.1**


### Property 12: Inventory Item Placement

*For any* item pickup, if inventory has available slots, the item should be added to the first available slot.

**Validates: Requirements 5.2**

### Property 13: Inventory Slot Management

*For any* two inventory slots, items should be movable between slots via drag and drop.

**Validates: Requirements 5.4**

### Property 14: Equipment Stat Application

*For any* equipment item, equipping it should add its stat bonuses to character stats, and unequipping should remove those bonuses (round-trip property).

**Validates: Requirements 5.6, 14.3**

### Property 15: Consumable Item Usage

*For any* consumable item, using it should apply its effect and remove the item from inventory.

**Validates: Requirements 5.5**

### Property 16: Skill Activation Validation

*For any* skill activation attempt, the system should validate mana cost and cooldown requirements before execution.

**Validates: Requirements 6.3**

### Property 17: Skill Effect and Cooldown

*For any* skill with met requirements, activation should execute the skill effect and apply the cooldown.

**Validates: Requirements 6.4**

### Property 18: Skill Proficiency Progression

*For any* skill used repeatedly, proficiency should increase with each use.

**Validates: Requirements 6.6**


### Property 19: Nearby Character Information

*For any* character entering a map, the server should send information about all nearby characters within render distance.

**Validates: Requirements 7.1**

### Property 20: Visible Character Limit

*For any* map area query, the server should return no more than 50 visible characters.

**Validates: Requirements 7.4**

### Property 21: Character Information Display

*For any* character, clicking on them should display their name, level, and guild information.

**Validates: Requirements 7.5**

### Property 22: Chat Message Validation

*For any* chat message, the server should validate message length and content before broadcasting.

**Validates: Requirements 8.2**

### Property 23: Chat Message Routing

*For any* chat message and channel type, the server should broadcast to appropriate recipients based on channel (All, Party, Guild, Whisper).

**Validates: Requirements 8.3**

### Property 24: Chat Profanity Filtering

*For any* chat message containing profanity or spam, the server should filter the content before broadcasting.

**Validates: Requirements 8.5**

### Property 25: Chat Rate Limiting

*For any* player sending more than 5 messages in 10 seconds, the server should block additional messages until the time window resets.

**Validates: Requirements 8.7**

### Property 26: Party Formation

*For any* two players where one invites and the other accepts, both characters should be added to the same party.

**Validates: Requirements 9.1, 9.2**


### Property 27: Party Experience Distribution

*For any* monster defeated by a party member, experience points should be distributed to all party members within range.

**Validates: Requirements 9.4**

### Property 28: Party Size Limit

*For any* party, attempting to add a 6th member should be rejected.

**Validates: Requirements 9.5**

### Property 29: Party Loot Distribution

*For any* item picked up by a party member, the server should use the configured loot distribution method.

**Validates: Requirements 9.6**

### Property 30: Party Chat Access

*For any* party chat message, only party members should receive the message.

**Validates: Requirements 9.7**

### Property 31: Trade Request Initiation

*For any* trade initiation between two players, a trade request should be sent to the target player.

**Validates: Requirements 10.1**

### Property 32: Trade Item Addition

*For any* trade window, players should be able to add items and gold to their trade offer.

**Validates: Requirements 10.3**

### Property 33: Trade Validation

*For any* trade confirmation, the server should validate that both players still have the offered items before executing.

**Validates: Requirements 10.4**

### Property 34: Trade Atomicity

*For any* confirmed trade, items and gold should be transferred simultaneously (all-or-nothing).

**Validates: Requirements 10.5**

### Property 35: Trade Audit Logging

*For any* completed trade, the server should log the transaction for audit purposes.

**Validates: Requirements 10.7**


### Property 36: Quest Acceptance

*For any* quest accepted by a player, it should be added to the character's active quest list.

**Validates: Requirements 11.2**

### Property 37: Quest Progress Tracking

*For any* quest objective completion, the quest status should be updated accordingly.

**Validates: Requirements 11.4**

### Property 38: Quest Reward Distribution

*For any* completed quest, the server should grant the specified rewards (experience, items, gold).

**Validates: Requirements 11.6**

### Property 39: Quest Completion Prevention

*For any* quest already completed by a character, the server should prevent repeated completion.

**Validates: Requirements 11.7**

### Property 40: Map Transition

*For any* portal transition confirmation, the character should be moved to the destination map.

**Validates: Requirements 12.3**

### Property 41: Map Level Requirements

*For any* map with level requirements, characters below the required level should be rejected from entering.

**Validates: Requirements 12.5**

### Property 42: Map Monster Spawning

*For any* character entering a map, the server should spawn appropriate monsters based on map configuration.

**Validates: Requirements 12.6**

### Property 43: Monster Spawn Location

*For any* monster spawn, it should appear at designated spawn points based on map configuration.

**Validates: Requirements 13.1**

### Property 44: Monster Patrol Behavior

*For any* idle monster, it should patrol within its defined patrol area.

**Validates: Requirements 13.2**


### Property 45: Monster Aggro Behavior

*For any* character entering a monster's aggro range, the monster should pursue and attack the character.

**Validates: Requirements 13.3**

### Property 46: Monster Respawn

*For any* defeated monster, it should respawn at its spawn point after the configured delay.

**Validates: Requirements 13.5**

### Property 47: Monster Stat Scaling

*For any* monster on a map, its stats should be scaled based on the map's difficulty level.

**Validates: Requirements 13.6**

### Property 48: Equipment Requirement Validation

*For any* equipment item, the server should validate class and level requirements before allowing equipping.

**Validates: Requirements 14.2**

### Property 49: Equipment Special Effects

*For any* equipment item with special options, the server should apply the additional effects when equipped.

**Validates: Requirements 14.5**

### Property 50: Authentication Validation

*For any* login attempt, the server should validate username and password, accepting valid credentials and rejecting invalid ones.

**Validates: Requirements 15.1, 15.4**

### Property 51: Password Hashing

*For any* password, bcrypt hashing should be used for storage, and verification should correctly validate matching passwords.

**Validates: Requirements 15.2**

### Property 52: JWT Token Generation

*For any* successful authentication, the server should generate a JWT token with 24-hour expiration.

**Validates: Requirements 15.3**


### Property 53: Login Rate Limiting

*For any* IP address with more than 5 failed login attempts in 15 minutes, subsequent attempts should be blocked.

**Validates: Requirements 15.5**

### Property 54: Session Token Invalidation

*For any* logout action, the session token should be invalidated and no longer accepted for authentication.

**Validates: Requirements 15.6**

### Property 55: JWT Token Inclusion

*For any* API request from an authenticated client, the JWT token should be included in the request headers.

**Validates: Requirements 15.7**

### Property 56: Character Data Persistence on Logout

*For any* normal logout, all character data (stats, position, inventory) should be immediately saved to the database.

**Validates: Requirements 16.2**

### Property 57: Character Data Persistence on Disconnect

*For any* unexpected disconnect, the last known character state should be saved to the database.

**Validates: Requirements 16.3**

### Property 58: Database Transaction Atomicity

*For any* multi-step database operation, transactions should ensure all steps complete or none complete (atomicity).

**Validates: Requirements 16.4**

### Property 59: Character Data Loading

*For any* player login, character data should be loaded from the database and restored to the game state.

**Validates: Requirements 16.5**

### Property 60: Spatial Partitioning Query Correctness

*For any* entity query using spatial partitioning, the results should match the results of a brute-force search (correctness over optimization).

**Validates: Requirements 17.5**


### Property 61: Server-Side Action Validation

*For any* client action, the server should validate it before applying effects (no client authority).

**Validates: Requirements 18.1**

### Property 62: Movement Speed Detection

*For any* movement request, the server should detect and reject impossible movement speeds and teleportation attempts.

**Validates: Requirements 18.2**

### Property 63: Suspicious Activity Logging

*For any* detected suspicious activity, the server should log the event and flag the account.

**Validates: Requirements 18.3**

### Property 64: Input Sanitization

*For any* user input, the server should sanitize it to prevent SQL injection and XSS attacks.

**Validates: Requirements 18.5**

### Property 65: API Rate Limiting

*For any* API endpoint, the server should implement rate limiting to prevent abuse.

**Validates: Requirements 18.6**

### Property 66: Configuration Parsing

*For any* valid JSON configuration file (Maps, Monsters, Items, Skills), the parser should successfully parse it into configuration objects.

**Validates: Requirements 20.1**

### Property 67: Configuration Schema Validation

*For any* configuration file, the parser should validate it against the schema and reject invalid configurations.

**Validates: Requirements 20.2**

### Property 68: Configuration Error Messages

*For any* invalid configuration file, the parser should return descriptive error messages indicating what is wrong.

**Validates: Requirements 20.3**

### Property 69: Configuration Pretty Printing

*For any* configuration object, the pretty printer should format it back into valid JSON.

**Validates: Requirements 20.4**


### Property 70: Configuration Round-Trip

*For any* valid configuration object, parsing then printing then parsing should produce an equivalent object (round-trip property).

**Validates: Requirements 20.5**

### Property 71: Configuration Numeric Range Validation

*For any* numeric value in a configuration file, the parser should validate it is within acceptable ranges and reject out-of-range values.

**Validates: Requirements 20.7**

## Error Handling

### Error Categories

The system implements comprehensive error handling across all layers:

**Client Errors (4xx)**:
- `400 Bad Request`: Invalid input data, malformed requests
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions for action
- `404 Not Found`: Requested resource does not exist
- `409 Conflict`: Resource conflict (e.g., character name already taken)
- `429 Too Many Requests`: Rate limit exceeded

**Server Errors (5xx)**:
- `500 Internal Server Error`: Unexpected server error
- `503 Service Unavailable`: Server overloaded or maintenance

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable error message
    field?: string;         // Field that caused error (for validation)
    details?: any;          // Additional error context
    timestamp: Date;
    correlationId: string;  // For tracking across services
  };
}
```

### Error Handling Strategies

**Validation Errors**:
```typescript
class ValidationError extends Error {
  constructor(
    public field: string,
    public message: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
  }
}

// Usage
if (!isValidCharacterName(name)) {
  throw new ValidationError(
    'name',
    'Character name contains invalid characters',
    'INVALID_CHARACTER_NAME'
  );
}
```


**Database Errors**:
```typescript
class DatabaseError extends Error {
  constructor(
    public operation: string,
    public originalError: Error,
    public code: string = 'DATABASE_ERROR'
  ) {
    super(`Database operation failed: ${operation}`);
  }
}

// Retry logic for transient failures
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1 || !isTransientError(error)) {
        throw error;
      }
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

**Network Errors**:
```typescript
class NetworkError extends Error {
  constructor(
    public message: string,
    public code: string = 'NETWORK_ERROR',
    public retryable: boolean = true
  ) {
    super(message);
  }
}

// Client-side reconnection logic
class ReconnectionManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  async reconnect(): Promise<void> {
    while (this.reconnectAttempts < this.maxReconnectAttempts) {
      try {
        await this.connect();
        this.reconnectAttempts = 0;
        return;
      } catch (error) {
        this.reconnectAttempts++;
        await delay(Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
      }
    }
    throw new NetworkError('Max reconnection attempts reached', 'MAX_RECONNECT_EXCEEDED', false);
  }
}
```

**Game Logic Errors**:
```typescript
class GameLogicError extends Error {
  constructor(
    public message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
  }
}

// Examples
throw new GameLogicError('Insufficient mana', 'INSUFFICIENT_MANA', { required: 50, current: 30 });
throw new GameLogicError('Item not found in inventory', 'ITEM_NOT_FOUND', { itemId });
throw new GameLogicError('Character level too low', 'LEVEL_REQUIREMENT_NOT_MET', { required: 10, current: 5 });
```


**Global Error Handler**:
```typescript
class GlobalErrorHandler {
  handle(error: Error, context: any): ErrorResponse {
    // Log error with context
    logger.error(error.message, {
      error: error.stack,
      context,
      correlationId: context.correlationId,
    });
    
    // Determine error type and response
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          field: error.field,
          timestamp: new Date(),
          correlationId: context.correlationId,
        },
      };
    }
    
    if (error instanceof DatabaseError) {
      // Don't expose internal database details to client
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred. Please try again.',
          timestamp: new Date(),
          correlationId: context.correlationId,
        },
      };
    }
    
    // Default error response
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date(),
        correlationId: context.correlationId,
      },
    };
  }
}
```

### Graceful Degradation

**Partial Functionality**:
- If chat service fails, game continues without chat
- If leaderboard service fails, game continues without rankings
- If asset loading fails, use fallback placeholder assets

**Circuit Breaker Pattern**:
```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime.getTime() > 60000) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();
      
      if (this.failureCount >= 5) {
        this.state = 'OPEN';
      }
      
      throw error;
    }
  }
}
```


## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests as complementary approaches:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Verify concrete scenarios with known inputs and expected outputs
- Test error conditions and boundary cases
- Validate integration between components
- Ensure specific business rules are correctly implemented

**Property-Based Tests**: Verify universal properties across all inputs
- Test properties that should hold for any valid input
- Automatically generate hundreds of test cases
- Discover edge cases that manual testing might miss
- Validate correctness guarantees across the input space

Together, these approaches provide comprehensive coverage: unit tests catch specific bugs and verify examples, while property tests ensure general correctness across all possible inputs.

### Property-Based Testing Configuration

**Library Selection**:
- **JavaScript/TypeScript**: `fast-check` library
- Mature, well-maintained property testing framework
- Excellent TypeScript support
- Rich set of built-in generators

**Test Configuration**:
```typescript
import fc from 'fast-check';

// Configure all property tests to run minimum 100 iterations
const propertyTestConfig = {
  numRuns: 100,  // Minimum iterations per property
  verbose: true,
  seed: Date.now(), // For reproducibility
};

// Example property test structure
describe('Character Creation', () => {
  it('Property 1: Character Creation with Valid Name', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 16 }).filter(isValidName),
        fc.constantFrom('DARK_KNIGHT', 'DARK_WIZARD', 'ELF'),
        (name, characterClass) => {
          // Feature: mu-dai-thien-su-h5-game, Property 1: For any valid character name and character class, creating a character should result in a new character with default stats for that class, starting equipment, and placement in the beginner map.
          
          const character = createCharacter(name, characterClass);
          
          expect(character.name).toBe(name);
          expect(character.class).toBe(characterClass);
          expect(character.stats).toEqual(getDefaultStats(characterClass));
          expect(character.equipment).toEqual(getStartingEquipment(characterClass));
          expect(character.mapId).toBe('BEGINNER_MAP');
        }
      ),
      propertyTestConfig
    );
  });
});
```

**Property Test Tagging**:
Each property test MUST include a comment tag referencing the design document property:
```typescript
// Feature: mu-dai-thien-su-h5-game, Property {number}: {property_text}
```

This ensures traceability between design properties and test implementation.


### Unit Testing Strategy

**Test Organization**:
```
tests/
├── unit/
│   ├── character/
│   │   ├── character-creation.test.ts
│   │   ├── character-stats.test.ts
│   │   └── character-progression.test.ts
│   ├── combat/
│   │   ├── damage-calculation.test.ts
│   │   ├── skill-system.test.ts
│   │   └── loot-generation.test.ts
│   ├── inventory/
│   │   ├── inventory-management.test.ts
│   │   └── equipment-system.test.ts
│   └── ...
├── integration/
│   ├── authentication-flow.test.ts
│   ├── party-system.test.ts
│   ├── trade-system.test.ts
│   └── quest-system.test.ts
└── property/
    ├── character-properties.test.ts
    ├── combat-properties.test.ts
    ├── inventory-properties.test.ts
    └── ...
```

**Unit Test Examples**:

```typescript
describe('CombatSystem', () => {
  describe('calculateDamage', () => {
    it('should calculate basic damage correctly', () => {
      // Arrange
      const attacker = createCharacter({ attack: 100 });
      const target = createMonster({ defense: 20 });
      
      // Act
      const damage = combatSystem.calculateDamage(attacker, target);
      
      // Assert
      expect(damage).toBe(80); // 100 - 20
    });
    
    it('should apply skill damage multiplier', () => {
      // Arrange
      const attacker = createCharacter({ attack: 100 });
      const target = createMonster({ defense: 20 });
      const skill = { damageMultiplier: 1.5 };
      
      // Act
      const damage = combatSystem.calculateDamage(attacker, target, skill);
      
      // Assert
      expect(damage).toBe(120); // (100 - 20) * 1.5
    });
    
    it('should handle minimum damage of 1', () => {
      // Arrange
      const attacker = createCharacter({ attack: 10 });
      const target = createMonster({ defense: 100 });
      
      // Act
      const damage = combatSystem.calculateDamage(attacker, target);
      
      // Assert
      expect(damage).toBe(1); // Minimum damage
    });
  });
});
```

**Edge Case Testing**:
```typescript
describe('Inventory Edge Cases', () => {
  it('should reject item pickup when inventory is full', () => {
    // Arrange
    const character = createCharacter();
    fillInventory(character); // Fill all 64 slots
    const item = createItem();
    
    // Act
    const result = inventorySystem.pickupItem(character, item);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('INVENTORY_FULL');
  });
  
  it('should cancel trade when recipient inventory is full', () => {
    // Arrange
    const player1 = createCharacter();
    const player2 = createCharacter();
    fillInventory(player2);
    const tradeItem = createItem();
    
    // Act
    const result = tradeSystem.executeTrade(player1, player2, [tradeItem], []);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('RECIPIENT_INVENTORY_FULL');
  });
});
```


### Integration Testing

**Critical Integration Points**:

```typescript
describe('Authentication Flow Integration', () => {
  it('should complete full login flow', async () => {
    // Arrange
    const credentials = { username: 'testuser', password: 'password123' };
    await accountRepository.create(credentials);
    
    // Act
    const loginResult = await authService.login(credentials);
    const verifyResult = await authService.verifyToken(loginResult.token);
    
    // Assert
    expect(loginResult.success).toBe(true);
    expect(loginResult.token).toBeDefined();
    expect(verifyResult.valid).toBe(true);
    expect(verifyResult.accountId).toBe(loginResult.accountId);
  });
});

describe('Party System Integration', () => {
  it('should distribute experience to party members', async () => {
    // Arrange
    const leader = await createCharacter({ level: 10 });
    const member = await createCharacter({ level: 10 });
    const party = await partyManager.createParty(leader.id);
    await partyManager.acceptInvite(member.id, party.id);
    
    const monster = createMonster({ expReward: 1000 });
    
    // Act
    await combatSystem.defeatMonster(leader, monster);
    
    // Assert
    const updatedLeader = await characterRepository.findById(leader.id);
    const updatedMember = await characterRepository.findById(member.id);
    
    expect(updatedLeader.experience).toBe(leader.experience + 500); // Split exp
    expect(updatedMember.experience).toBe(member.experience + 500);
  });
});

describe('Trade System Integration', () => {
  it('should execute atomic trade between players', async () => {
    // Arrange
    const player1 = await createCharacter();
    const player2 = await createCharacter();
    const item1 = await createItem({ name: 'Sword' });
    const item2 = await createItem({ name: 'Shield' });
    
    await inventorySystem.addItem(player1, item1);
    await inventorySystem.addItem(player2, item2);
    
    // Act
    const result = await tradeSystem.executeTrade(
      player1.id,
      player2.id,
      [item1.id],
      [item2.id]
    );
    
    // Assert
    expect(result.success).toBe(true);
    
    const p1Inventory = await inventorySystem.getInventory(player1.id);
    const p2Inventory = await inventorySystem.getInventory(player2.id);
    
    expect(p1Inventory.items).toContainEqual(expect.objectContaining({ name: 'Shield' }));
    expect(p2Inventory.items).toContainEqual(expect.objectContaining({ name: 'Sword' }));
    expect(p1Inventory.items).not.toContainEqual(expect.objectContaining({ name: 'Sword' }));
    expect(p2Inventory.items).not.toContainEqual(expect.objectContaining({ name: 'Shield' }));
  });
});
```

### Test Data Generators

**Custom Generators for Property Tests**:

```typescript
// Character generator
const characterGen = fc.record({
  name: fc.string({ minLength: 3, maxLength: 16 }).filter(isValidName),
  class: fc.constantFrom('DARK_KNIGHT', 'DARK_WIZARD', 'ELF'),
  level: fc.integer({ min: 1, max: 400 }),
  stats: fc.record({
    strength: fc.integer({ min: 0, max: 10000 }),
    agility: fc.integer({ min: 0, max: 10000 }),
    vitality: fc.integer({ min: 0, max: 10000 }),
    energy: fc.integer({ min: 0, max: 10000 }),
  }),
});

// Monster generator
const monsterGen = fc.record({
  level: fc.integer({ min: 1, max: 500 }),
  stats: fc.record({
    health: fc.integer({ min: 100, max: 100000 }),
    attack: fc.integer({ min: 10, max: 5000 }),
    defense: fc.integer({ min: 0, max: 2000 }),
  }),
});

// Item generator
const itemGen = fc.record({
  type: fc.constantFrom('WEAPON', 'ARMOR', 'HELM', 'GLOVES', 'BOOTS', 'ACCESSORY'),
  stats: fc.record({
    attack: fc.option(fc.integer({ min: 0, max: 500 })),
    defense: fc.option(fc.integer({ min: 0, max: 500 })),
  }),
  requirements: fc.record({
    level: fc.integer({ min: 1, max: 400 }),
    class: fc.array(fc.constantFrom('DARK_KNIGHT', 'DARK_WIZARD', 'ELF'), { minLength: 1 }),
  }),
});

// Position generator
const positionGen = fc.record({
  x: fc.float({ min: 0, max: 10000 }),
  y: fc.float({ min: 0, max: 10000 }),
});

// Configuration generator
const configGen = fc.record({
  mapId: fc.string({ minLength: 1, maxLength: 50 }),
  monsters: fc.array(monsterGen, { maxLength: 100 }),
  spawnPoints: fc.array(positionGen, { maxLength: 50 }),
});
```


### Property Test Examples

**Round-Trip Properties**:

```typescript
describe('Configuration Round-Trip', () => {
  it('Property 70: Configuration Round-Trip', () => {
    fc.assert(
      fc.property(configGen, (config) => {
        // Feature: mu-dai-thien-su-h5-game, Property 70: For any valid configuration object, parsing then printing then parsing should produce an equivalent object (round-trip property).
        
        const printed = configPrinter.print(config);
        const parsed = configParser.parse(printed);
        const reprinted = configPrinter.print(parsed);
        const reparsed = configParser.parse(reprinted);
        
        expect(reparsed).toEqual(config);
      }),
      propertyTestConfig
    );
  });
});

describe('Equipment Stat Application', () => {
  it('Property 14: Equipment Stat Application', () => {
    fc.assert(
      fc.property(characterGen, itemGen, (character, equipment) => {
        // Feature: mu-dai-thien-su-h5-game, Property 14: For any equipment item, equipping it should add its stat bonuses to character stats, and unequipping should remove those bonuses (round-trip property).
        
        const originalStats = { ...character.stats };
        
        equipmentSystem.equip(character, equipment);
        const equippedStats = { ...character.stats };
        
        equipmentSystem.unequip(character, equipment);
        const finalStats = { ...character.stats };
        
        expect(finalStats).toEqual(originalStats);
        
        // Verify stats were actually modified when equipped
        if (equipment.stats.attack) {
          expect(equippedStats.attack).toBeGreaterThan(originalStats.attack);
        }
      }),
      propertyTestConfig
    );
  });
});
```

**Invariant Properties**:

```typescript
describe('Party Size Invariant', () => {
  it('Property 28: Party Size Limit', () => {
    fc.assert(
      fc.property(
        fc.array(characterGen, { minLength: 6, maxLength: 10 }),
        (characters) => {
          // Feature: mu-dai-thien-su-h5-game, Property 28: For any party, attempting to add a 6th member should be rejected.
          
          const party = partyManager.createParty(characters[0].id);
          
          // Add first 5 members successfully
          for (let i = 1; i < 5; i++) {
            const result = partyManager.acceptInvite(characters[i].id, party.id);
            expect(result.success).toBe(true);
          }
          
          // 6th member should be rejected
          const sixthResult = partyManager.acceptInvite(characters[5].id, party.id);
          expect(sixthResult.success).toBe(false);
          expect(sixthResult.error.code).toBe('PARTY_FULL');
          
          // Verify party size never exceeds 5
          const partyData = partyManager.getParty(party.id);
          expect(partyData.members.length).toBeLessThanOrEqual(5);
        }
      ),
      propertyTestConfig
    );
  });
});

describe('Spatial Partitioning Correctness', () => {
  it('Property 60: Spatial Partitioning Query Correctness', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.string(), positionGen), { maxLength: 100 }),
        positionGen,
        fc.float({ min: 0, max: 1000 }),
        (entities, queryPos, range) => {
          // Feature: mu-dai-thien-su-h5-game, Property 60: For any entity query using spatial partitioning, the results should match the results of a brute-force search (correctness over optimization).
          
          const spatialGrid = new SpatialHashGrid();
          
          // Insert all entities
          entities.forEach(([id, pos]) => {
            spatialGrid.insert(id, pos);
          });
          
          // Query using spatial partitioning
          const spatialResults = spatialGrid.query(queryPos, range);
          
          // Brute force search
          const bruteForceResults = entities
            .filter(([id, pos]) => {
              const distance = Math.sqrt(
                Math.pow(pos.x - queryPos.x, 2) + Math.pow(pos.y - queryPos.y, 2)
              );
              return distance <= range;
            })
            .map(([id]) => id);
          
          // Results should match
          expect(new Set(spatialResults)).toEqual(new Set(bruteForceResults));
        }
      ),
      propertyTestConfig
    );
  });
});
```


**Validation Properties**:

```typescript
describe('Input Validation', () => {
  it('Property 2: Character Name Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string().filter(name => name.includes('<')),  // XSS attempt
          fc.string().filter(name => name.includes('DROP')), // SQL injection
          fc.string({ minLength: 0, maxLength: 2 }),        // Too short
          fc.string({ minLength: 17 }),                     // Too long
          fc.constant(''),                                   // Empty
        ),
        (invalidName) => {
          // Feature: mu-dai-thien-su-h5-game, Property 2: For any character name that is already taken or contains invalid characters, the server should reject the creation request.
          
          const result = characterService.createCharacter(invalidName, 'DARK_KNIGHT');
          
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(['INVALID_NAME', 'NAME_TOO_SHORT', 'NAME_TOO_LONG', 'INVALID_CHARACTERS'])
            .toContain(result.error.code);
        }
      ),
      propertyTestConfig
    );
  });
  
  it('Property 64: Input Sanitization', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant("'; DROP TABLE users; --"),
          fc.constant('<script>alert("XSS")</script>'),
          fc.constant('"><img src=x onerror=alert(1)>'),
          fc.constant("' OR '1'='1"),
        ),
        (maliciousInput) => {
          // Feature: mu-dai-thien-su-h5-game, Property 64: For any user input, the server should sanitize it to prevent SQL injection and XSS attacks.
          
          const sanitized = inputSanitizer.sanitize(maliciousInput);
          
          // Should not contain dangerous patterns
          expect(sanitized).not.toContain('<script>');
          expect(sanitized).not.toContain('DROP TABLE');
          expect(sanitized).not.toContain('onerror=');
          expect(sanitized).not.toMatch(/['";]/);
        }
      ),
      propertyTestConfig
    );
  });
});

describe('Movement Validation', () => {
  it('Property 62: Movement Speed Detection', () => {
    fc.assert(
      fc.property(
        characterGen,
        positionGen,
        positionGen,
        fc.float({ min: 0.001, max: 0.1 }), // deltaTime in seconds
        (character, startPos, endPos, deltaTime) => {
          // Feature: mu-dai-thien-su-h5-game, Property 62: For any movement request, the server should detect and reject impossible movement speeds and teleportation attempts.
          
          character.position = startPos;
          const distance = Math.sqrt(
            Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
          );
          const maxDistance = character.stats.moveSpeed * deltaTime;
          
          const result = movementValidator.validateMove(character, endPos, deltaTime);
          
          if (distance > maxDistance * 1.1) { // 10% tolerance
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('IMPOSSIBLE_SPEED');
          } else {
            expect(result.valid).toBe(true);
          }
        }
      ),
      propertyTestConfig
    );
  });
});
```

### Test Coverage Requirements

**Minimum Coverage Targets**:
- Overall code coverage: 80%
- Critical paths (combat, trading, authentication): 95%
- Business logic layer: 90%
- Data access layer: 85%
- Utility functions: 80%

**Coverage Monitoring**:
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/combat/**/*.ts": {
        "branches": 95,
        "functions": 95,
        "lines": 95,
        "statements": 95
      },
      "./src/trade/**/*.ts": {
        "branches": 95,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    }
  }
}
```

### Continuous Integration

**CI Pipeline Test Execution**:
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run property tests
        run: npm run test:property
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/coverage-final.json
      
      - name: Check coverage thresholds
        run: npm run test:coverage:check
```

### Performance Testing

**Load Testing**:
- Simulate 1000 concurrent players
- Measure server response times (target: p95 < 100ms)
- Monitor resource usage (CPU, memory, network)
- Test database query performance

**Stress Testing**:
- Gradually increase load until system degrades
- Identify bottlenecks and breaking points
- Verify graceful degradation under load
- Test recovery after stress conditions

**Tools**:
- Artillery for load testing
- k6 for performance testing
- PostgreSQL EXPLAIN ANALYZE for query optimization
