# Technology Stack

## Build System

- **Package Manager**: npm (workspaces for monorepo)
- **Build Tool (Client)**: Webpack 5 with ts-loader
- **Build Tool (Server)**: TypeScript compiler (tsc)
- **Development**: ts-node-dev for server hot reload, webpack-dev-server for client

## Core Technologies

### Client
- **Framework**: Phaser 3 (WebGL game framework)
- **Language**: TypeScript 5.3+ (strict mode)
- **Bundler**: Webpack 5
- **Dev Server**: webpack-dev-server (port 3000)

### Server
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+ (strict mode)
- **Web Framework**: Express
- **WebSocket**: ws library
- **Database**: PostgreSQL 15+
- **Cache**: Redis 4+
- **Authentication**: JWT (jsonwebtoken) + bcrypt

### Testing
- **Framework**: Jest 29+
- **Property-Based Testing**: fast-check
- **Environment**: jsdom (client), node (server)

## Common Commands

### Development
```bash
# Start client dev server (http://localhost:3000)
npm run dev:client

# Start server dev server
npm run dev:server

# Install dependencies
npm install
```

### Building
```bash
# Build all packages
npm run build

# Build specific package
npm run build:client
npm run build:server

# Clean build artifacts
npm run clean
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run property-based tests
npm run test:property

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### Database
```bash
# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Check migration status
npm run migrate:status

# Reset database (CAUTION: deletes all data)
npm run migrate:reset
```

### Code Quality
```bash
# Run linter
npm run lint
```

## TypeScript Configuration

- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled (all strict flags on)
- **Source Maps**: Enabled
- **Declaration Files**: Generated

## ESLint Rules

- Explicit function return types (warn)
- No explicit any (warn)
- No unused variables (error, except prefixed with _)
- No console (warn, except warn/error)
- Max line length: 120 characters

## Webpack Configuration

### Development
- Hot module replacement enabled
- eval-source-map for debugging
- Dev server on port 3000

### Production
- Content hash for cache busting
- Code splitting (vendors, phaser)
- Source maps for debugging
- Asset optimization

## Environment Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 15.0
- Redis >= 4.0
