# Codebase Structure Documentation

**Owner:** Developer  
**Purpose:** Help team navigate and understand codebase  
**Last Updated:** 2026-03-03

---

## Project Overview

**Project Name:** MU H5 (HTML5 MMORPG Game)  
**Type:** Monorepo with multiple packages  
**Tech Stack:**
- Frontend: TypeScript, HTML5 Canvas, Webpack
- Backend: Node.js, TypeScript, WebSocket
- Database: PostgreSQL
- Testing: Jest

---

## Repository Structure

```
muh5/
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── jest.config.js            # Root Jest configuration
├── package.json              # Root package dependencies
├── CHANGELOG.md              # Version history
│
├── packages/
│   ├── client/               # Frontend client package
│   └── server/               # Backend server package
│
└── .kiro/                    # Kiro AI team workspace
    ├── docs/                 # Documentation
    ├── memory/               # Decision history
    ├── skills/               # Agent skills
    └── steering/             # Team guidelines
```

---

## Client Package (`packages/client/`)

### Structure

```
packages/client/
├── src/
│   ├── index.html            # Entry HTML file
│   ├── index.ts              # Application entry point
│   │
│   ├── input/                # Input handling
│   │   ├── InputHandler.ts  # Keyboard/mouse input
│   │   └── __tests__/
│   │
│   ├── movement/             # Character movement
│   │   ├── MovementController.ts  # Movement logic
│   │   ├── Pathfinder.ts          # A* pathfinding
│   │   ├── PositionInterpolator.ts # Smooth movement
│   │   └── __tests__/
│   │
│   ├── network/              # Network communication
│   │   ├── NetworkClient.ts # WebSocket client
│   │   └── __tests__/
│   │
│   ├── rendering/            # Graphics rendering
│   │   ├── RenderingEngine.ts # Main renderer
│   │   ├── MapRenderer.ts     # Map/terrain rendering
│   │   └── Minimap.ts         # Minimap component
│   │
│   ├── scenes/               # Game scenes
│   │   ├── CharacterCreationScene.ts
│   │   └── MapTransitionScene.ts
│   │
│   └── state/                # State management
│       └── GameStateManager.ts
│
├── jest.config.js            # Jest configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── webpack.config.js         # Webpack bundler config
└── README.md                 # Client documentation
```

### Key Components

#### 1. Entry Point (`index.ts`)
**Purpose:** Initialize and start the game

```typescript
// Main initialization flow:
1. Load configuration
2. Initialize rendering engine
3. Setup input handlers
4. Connect to server (NetworkClient)
5. Start game loop
```

**Dependencies:**
- RenderingEngine
- InputHandler
- NetworkClient
- GameStateManager

---

#### 2. Input System (`input/`)

**InputHandler.ts**
- Handles keyboard and mouse events
- Translates input to game actions
- Supports key bindings configuration

**Key Methods:**
- `handleKeyDown(event)` - Process keyboard input
- `handleMouseClick(event)` - Process mouse clicks
- `handleMouseMove(event)` - Track mouse position

**Used By:** MovementController, UI components

---

#### 3. Movement System (`movement/`)

**MovementController.ts**
- Manages character movement
- Validates movement requests
- Sends movement commands to server

**Pathfinder.ts**
- A* pathfinding algorithm
- Finds optimal path avoiding obstacles
- Handles dynamic obstacles

**PositionInterpolator.ts**
- Smooth character movement animation
- Interpolates between server position updates
- Reduces jitter from network latency

**Flow:**
```
User Click → Pathfinder → MovementController → NetworkClient → Server
                                                      ↓
Server Response → PositionInterpolator → RenderingEngine
```

---

#### 4. Network System (`network/`)

**NetworkClient.ts**
- WebSocket connection to server
- Message serialization/deserialization
- Connection state management
- Automatic reconnection

**Message Types:**
- `MOVE` - Character movement
- `ATTACK` - Combat actions
- `CHAT` - Chat messages
- `STATE_UPDATE` - Server state sync

**Used By:** All systems that need server communication

---

#### 5. Rendering System (`rendering/`)

**RenderingEngine.ts**
- Main rendering loop (60 FPS target)
- Canvas management
- Layer rendering (background, characters, UI)
- Camera system

**MapRenderer.ts**
- Renders game map/terrain
- Tile-based rendering
- Viewport culling for performance

**Minimap.ts**
- Small overview map
- Player position indicator
- Points of interest

**Rendering Pipeline:**
```
Game Loop → RenderingEngine → MapRenderer → Character Sprites → UI Layer
```

---

#### 6. Scenes System (`scenes/`)

**CharacterCreationScene.ts**
- Character creation UI
- Class selection
- Appearance customization

**MapTransitionScene.ts**
- Loading screen between maps
- Asset preloading
- Smooth transitions

---

#### 7. State Management (`state/`)

**GameStateManager.ts**
- Centralized game state
- State synchronization with server
- Event-driven updates

**State Structure:**
```typescript
{
  player: { id, position, stats, inventory },
  characters: Map<id, Character>,
  map: { id, name, tiles },
  ui: { activeWindows, notifications }
}
```

---

## Server Package (`packages/server/`)

### Structure

```
packages/server/
├── src/
│   ├── index.ts              # Server entry point
│   │
│   ├── config/               # Configuration management
│   │   ├── index.ts          # Config loader
│   │   ├── parser.ts         # Config parser
│   │   ├── validator.ts      # Config validation
│   │   ├── types.ts          # Config types
│   │   ├── pretty-printer.ts # Config display
│   │   └── __tests__/
│   │
│   ├── database/             # Database layer
│   │   ├── index.ts          # DB exports
│   │   ├── connection.ts     # Connection pool
│   │   ├── migrator.ts       # Migration runner
│   │   ├── cli.ts            # CLI commands
│   │   ├── schema.sql        # Database schema
│   │   ├── migrations/       # Migration files
│   │   └── README.md
│   │
│   ├── infrastructure/       # Infrastructure services
│   │   ├── index.ts
│   │   ├── websocket-server.ts    # WebSocket server
│   │   ├── redis-client.ts        # Redis connection
│   │   ├── rate-limiter.service.ts # Rate limiting
│   │   └── token-blacklist.service.ts
│   │
│   ├── middleware/           # Express/WS middleware
│   │   ├── index.ts
│   │   ├── auth.middleware.ts # Authentication
│   │   ├── example-usage.ts
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── presentation/         # Presentation layer
│   │   ├── index.ts
│   │   └── websocket-handlers.ts # WS message handlers
│   │
│   ├── repositories/         # Data access layer
│   │   ├── index.ts
│   │   ├── account.repository.ts
│   │   ├── character.repository.ts
│   │   └── __tests__/
│   │
│   └── services/             # Business logic layer
│       ├── index.ts
│       ├── auth.service.ts
│       ├── character.service.ts
│       ├── combat.service.ts
│       ├── combat-validator.service.ts
│       ├── loot.service.ts
│       ├── map-transition.service.ts
│       ├── movement-validator.service.ts
│       ├── position-broadcaster.service.ts
│       ├── README.md
│       └── __tests__/
│
├── .env.example              # Environment variables template
├── jest.config.js
├── package.json
└── README.md
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer                │  WebSocket handlers
│   (presentation/)                   │  HTTP endpoints
├─────────────────────────────────────┤
│   Application Layer                 │  Business logic
│   (services/)                       │  Use cases
├─────────────────────────────────────┤
│   Domain Layer                      │  Entities
│   (models/ - not yet implemented)   │  Domain logic
├─────────────────────────────────────┤
│   Infrastructure Layer              │  Database
│   (repositories/, infrastructure/)  │  External services
└─────────────────────────────────────┘
```

---

### Key Components

#### 1. Entry Point (`index.ts`)
**Purpose:** Initialize and start server

```typescript
// Server initialization flow:
1. Load configuration
2. Connect to database
3. Connect to Redis
4. Initialize WebSocket server
5. Setup middleware
6. Register message handlers
7. Start listening
```

---

#### 2. Configuration System (`config/`)

**Purpose:** Centralized configuration management

**Files:**
- `index.ts` - Main config loader
- `parser.ts` - Parse config files
- `validator.ts` - Validate config values
- `types.ts` - TypeScript types
- `pretty-printer.ts` - Display config

**Usage:**
```typescript
import { config } from './config';

const dbUrl = config.database.url;
const port = config.server.port;
```

---

#### 3. Database Layer (`database/`)

**connection.ts**
- PostgreSQL connection pool
- Connection management
- Query execution

**migrator.ts**
- Database migration runner
- Version tracking
- Rollback support

**Migration Files:**
- `001_initial_schema.sql` - Initial tables
- `001_initial_schema_down.sql` - Rollback
- `002_add_failed_login_attempts.sql` - Add security

**CLI Commands:**
```bash
npm run db:migrate        # Run migrations
npm run db:rollback       # Rollback last migration
npm run db:reset          # Reset database
```

---

#### 4. Infrastructure Layer (`infrastructure/`)

**websocket-server.ts**
- WebSocket server setup
- Connection management
- Message routing

**redis-client.ts**
- Redis connection
- Caching
- Session storage

**rate-limiter.service.ts**
- Rate limiting per IP/user
- Prevents abuse
- Configurable limits

**token-blacklist.service.ts**
- JWT token blacklist
- Logout functionality
- Token revocation

---

#### 5. Middleware (`middleware/`)

**auth.middleware.ts**
- JWT token validation
- User authentication
- Permission checking

**Usage:**
```typescript
// Protect WebSocket messages
wsServer.use(authMiddleware);

// Protect specific handlers
wsServer.on('MOVE', authMiddleware, moveHandler);
```

---

#### 6. Presentation Layer (`presentation/`)

**websocket-handlers.ts**
- Message handlers for WebSocket
- Request validation
- Response formatting

**Message Handlers:**
- `handleMove` - Character movement
- `handleAttack` - Combat actions
- `handleChat` - Chat messages
- `handleLogin` - Authentication

---

#### 7. Repositories (`repositories/`)

**Purpose:** Data access layer (Database operations)

**account.repository.ts**
- User account CRUD
- Authentication queries
- Account management

**character.repository.ts**
- Character CRUD
- Character queries
- Inventory management

**Pattern:**
```typescript
class AccountRepository {
  async findById(id: string): Promise<Account | null>
  async findByEmail(email: string): Promise<Account | null>
  async create(data: CreateAccountDto): Promise<Account>
  async update(id: string, data: UpdateAccountDto): Promise<Account>
  async delete(id: string): Promise<void>
}
```

---

#### 8. Services (`services/`)

**Purpose:** Business logic layer

**auth.service.ts**
- User registration
- Login/logout
- Password hashing
- JWT token generation

**character.service.ts**
- Character creation
- Character management
- Stat calculations

**combat.service.ts**
- Combat calculations
- Damage formulas
- Experience/loot distribution

**combat-validator.service.ts**
- Validate combat actions
- Check range, cooldowns
- Anti-cheat validation

**movement-validator.service.ts**
- Validate movement requests
- Check speed, obstacles
- Anti-cheat validation

**position-broadcaster.service.ts**
- Broadcast position updates
- Area of interest (AOI) management
- Optimize network traffic

**map-transition.service.ts**
- Handle map changes
- Load/unload map data
- Sync player state

**loot.service.ts**
- Loot generation
- Drop calculations
- Inventory management

---

## Data Flow Examples

### Example 1: Player Movement

```
Client Side:
1. User clicks on map
2. Pathfinder calculates path
3. MovementController validates
4. NetworkClient sends MOVE message

Server Side:
5. WebSocket receives MOVE
6. auth.middleware validates token
7. movement-validator.service validates move
8. character.repository updates position
9. position-broadcaster.service broadcasts to nearby players

Client Side (Other Players):
10. NetworkClient receives position update
11. PositionInterpolator smooths movement
12. RenderingEngine renders character
```

---

### Example 2: User Login

```
Client Side:
1. User enters email/password
2. NetworkClient sends LOGIN message

Server Side:
3. WebSocket receives LOGIN
4. auth.service validates credentials
5. auth.service generates JWT token
6. account.repository updates last_login
7. Send token + user data to client

Client Side:
8. Store JWT token
9. Load game scene
10. Connect to game server with token
```

---

### Example 3: Combat

```
Client Side:
1. User clicks attack button
2. NetworkClient sends ATTACK message

Server Side:
3. auth.middleware validates token
4. combat-validator.service validates attack
5. combat.service calculates damage
6. character.repository updates HP
7. loot.service generates drops (if kill)
8. position-broadcaster.service broadcasts to area

Client Side (All Players in Area):
9. NetworkClient receives combat update
10. RenderingEngine shows damage numbers
11. Update character HP bars
```

---

## Common Patterns

### 1. Repository Pattern
```typescript
// All database access goes through repositories
const user = await accountRepository.findById(userId);
```

### 2. Service Layer Pattern
```typescript
// Business logic in services
const result = await authService.login(email, password);
```

### 3. Dependency Injection
```typescript
// Services receive dependencies via constructor
class CombatService {
  constructor(
    private characterRepo: CharacterRepository,
    private lootService: LootService
  ) {}
}
```

### 4. Event-Driven Architecture
```typescript
// Services emit events, others listen
eventEmitter.on('character:levelUp', handleLevelUp);
```

---

## Testing Structure

### Unit Tests
- Located in `__tests__/` folders
- Test individual functions/classes
- Mock dependencies

### Integration Tests
- Test multiple components together
- Use test database
- Test API endpoints

### Running Tests
```bash
# Run all tests
npm test

# Run specific package tests
npm test --workspace=packages/server

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Build & Development

### Development Mode
```bash
# Start both client and server in dev mode
npm run dev

# Start only client
npm run dev:client

# Start only server
npm run dev:server
```

### Production Build
```bash
# Build both packages
npm run build

# Build specific package
npm run build --workspace=packages/client
```

### Linting
```bash
# Lint all code
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## Environment Variables

### Server (`.env`)
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/muh5

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
```

### Client
- Configuration in `webpack.config.js`
- API endpoint configured at build time

---

## Quick Reference

### Where to Find...

**Authentication logic:** `packages/server/src/services/auth.service.ts`  
**Database queries:** `packages/server/src/repositories/`  
**WebSocket handlers:** `packages/server/src/presentation/websocket-handlers.ts`  
**Game rendering:** `packages/client/src/rendering/RenderingEngine.ts`  
**Movement logic:** `packages/client/src/movement/MovementController.ts`  
**Network communication:** `packages/client/src/network/NetworkClient.ts`  
**Configuration:** `packages/server/src/config/`  
**Database migrations:** `packages/server/src/database/migrations/`  
**Tests:** `**/__tests__/` folders

---

## Next Steps for New Developers

1. **Setup Development Environment:**
   - Install Node.js, PostgreSQL, Redis
   - Clone repository
   - Run `npm install`
   - Copy `.env.example` to `.env`
   - Run database migrations

2. **Understand Architecture:**
   - Read this document
   - Review architecture decisions in `.kiro/docs/architecture/`
   - Study layered architecture pattern

3. **Run the Application:**
   - Start server: `npm run dev:server`
   - Start client: `npm run dev:client`
   - Open browser to `http://localhost:8080`

4. **Make Your First Change:**
   - Pick a small task
   - Write tests first (TDD)
   - Implement feature
   - Run tests and linting
   - Submit PR for review

---

**Status:** ✅ COMPLETE  
**Owner:** Developer  
**Last Updated:** 2026-03-03  
**Next Review:** When major changes occur
