# Product Overview

## Mu Đại Thiên Sứ H5

HTML5 MMORPG game inspired by Mu Online, built as a real-time multiplayer browser game.

## Core Features

- Real-time multiplayer gameplay via WebSocket
- Character creation and progression (levels 1-400)
- Combat system with damage calculation and equipment bonuses
- Inventory management (64 slots)
- Equipment system (weapon, armor, accessories)
- Skill system with proficiency tracking
- Quest system with progress tracking
- Trade system with audit logging
- Movement and pathfinding
- Map transitions

## Technical Approach

- Client-server architecture with WebSocket for real-time communication
- WebGL-accelerated 2D rendering using Phaser 3
- PostgreSQL for persistent game data
- Redis for session management and caching
- JWT-based authentication with bcrypt password hashing
- Property-based testing for critical game logic

## Target Platform

Browser-based HTML5 game, accessible on desktop and mobile devices.

## Quality Standards

- 80% minimum test coverage
- TypeScript strict mode for type safety
- Comprehensive security measures (rate limiting, input validation, anti-cheat)
- Performance optimization (object pooling, lazy loading, sprite batching)
