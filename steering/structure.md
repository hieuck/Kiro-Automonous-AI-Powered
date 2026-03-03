# Project Structure

## Monorepo Organization

```
muh5/                           # Project root
├── packages/                   # Workspace packages
│   ├── client/                # Game client (Phaser 3)
│   └── server/                # Game server (Node.js)
├── package.json               # Root workspace config
├── tsconfig.json              # Shared TypeScript config
├── .eslintrc.js               # Shared ESLint config
└── jest.config.js             # Shared Jest config
```

## Client Package Structure

```
packages/client/
├── src/
│   ├── scenes/                # Phaser game scenes
│   │   ├── CharacterCreationScene.ts
│   │   └── MapTransitionScene.ts
│   ├── rendering/             # Rendering systems
│   │   ├── RenderingEngine.ts
│   │   ├── MapRenderer.ts
│   │   └── Minimap.ts
│   ├── movement/              # Movement systems
│   │   ├── MovementController.ts
│   │   ├── Pathfinder.ts
│   │   └── PositionInterpolator.ts
│   ├── input/                 # Input handling
│   │   └── InputHandler.ts
│   ├── network/               # WebSocket client
│   │   └── NetworkClient.ts
│   ├── state/                 # State management
│   │   └── GameStateManager.ts
│   ├── index.html             # HTML template
│   └── index.ts               # Entry point
├── webpack.config.js          # Webpack configuration
├── package.json               # Client dependencies
└── tsconfig.json              # Client TypeScript config
```

## Server Package Structure

```
packages/server/
├── src/
│   ├── presentation/          # WebSocket handlers, API controllers
│   │   └── index.ts
│   ├── services/              # Application layer (business logic)
│   │   ├── auth.service.ts
│   │   ├── character.service.ts
│   │   ├── combat.service.ts
│   │   ├── loot.service.ts
│   │   └── progression.service.ts
│   ├── repositories/          # Data access layer
│   │   ├── account.repository.ts
│   │   └── character.repository.ts
│   ├── infrastructure/        # External services
│   │   ├── websocket-server.ts
│   │   ├── redis-client.ts
│   │   ├── rate-limiter.service.ts
│   │   └── token-blacklist.service.ts
│   ├── middleware/            # Express/WebSocket middleware
│   │   ├── auth.middleware.ts
│   │   └── request-logger.ts
│   ├── database/              # Database management
│   │   ├── connection.ts
│   │   ├── cli.ts
│   │   └── migrations/
│   ├── config/                # Configuration management
│   │   ├── index.ts
│   │   ├── parser.ts
│   │   ├── validator.ts
│   │   └── pretty-printer.ts
│   ├── world/                 # Game world data
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Helper functions
│   └── index.ts               # Server entry point
├── .env.example               # Environment variables template
├── package.json               # Server dependencies
└── tsconfig.json              # Server TypeScript config
```

## Layered Architecture

The server follows a strict layered architecture:

1. **Presentation Layer** (`presentation/`)
   - WebSocket handlers
   - Request/response handling
   - Input validation

2. **Application Layer** (`services/`)
   - Business logic
   - Use cases
   - Transaction management

3. **Domain Layer** (embedded in services)
   - Core entities
   - Business rules
   - Domain logic

4. **Infrastructure Layer** (`infrastructure/`, `repositories/`, `database/`)
   - Database access
   - External services
   - Technical concerns

## Test Organization

Tests are co-located with source files in `__tests__/` directories:

```
src/
├── services/
│   ├── combat.service.ts
│   └── __tests__/
│       ├── combat.service.test.ts        # Unit tests
│       ├── combat.service.property.ts    # Property-based tests
│       └── combat.service.integration.ts # Integration tests
```

## Configuration Files

- **Environment Variables**: `.env` (server only, not committed)
- **TypeScript**: `tsconfig.json` (root + per-package)
- **ESLint**: `.eslintrc.js` (root, shared)
- **Jest**: `jest.config.js` (root + per-package)
- **Webpack**: `webpack.config.js` (client only)

## Database Migrations

```
packages/server/src/database/migrations/
├── 001_initial_schema.sql
├── 001_initial_schema_down.sql
├── 002_add_features.sql
└── 002_add_features_down.sql
```

Migrations are numbered sequentially with up/down pairs.

## Naming Conventions

- **Files**: kebab-case (e.g., `combat.service.ts`)
- **Classes**: PascalCase (e.g., `CombatService`)
- **Functions/Variables**: camelCase (e.g., `calculateDamage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_LEVEL`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `Character` or `ICharacter`)
