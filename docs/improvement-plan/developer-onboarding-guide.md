# Developer Onboarding Guide
## For Future Team Members

**Created:** March 3, 2026  
**Owner:** Developer  
**Purpose:** Streamline onboarding for second developer hire

---

## Welcome to the Team! 🎉

This guide will help you get up to speed quickly. We've documented everything you need to know to become productive in your first 30 days.

---

## Day 1: Environment Setup

### Required Tools
```bash
# Node.js & npm
node --version  # Should be v18+
npm --version   # Should be v9+

# Git
git --version

# VS Code (recommended) or your preferred IDE
code --version

# Docker (for local database)
docker --version
```

### Repository Setup
```bash
# Clone repository
git clone [repository-url]
cd muh5

# Install dependencies
npm install

# Install client dependencies
cd packages/client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Configuration
```bash
# Server environment
cd packages/server
cp .env.example .env
# Edit .env with your local configuration
```

### Database Setup
```bash
# Start local PostgreSQL (Docker)
docker run --name muh5-postgres \
  -e POSTGRES_PASSWORD=dev_password \
  -e POSTGRES_DB=muh5_dev \
  -p 5432:5432 \
  -d postgres:15

# Run migrations
npm run db:migrate
```

### Verify Setup
```bash
# Run tests
npm test

# Start development server
npm run dev

# Client should be at http://localhost:8080
# Server should be at http://localhost:3000
```

---

## Day 2-3: Codebase Overview

### Project Structure
```
muh5/
├── packages/
│   ├── client/          # Frontend (TypeScript + Webpack)
│   │   ├── src/
│   │   │   ├── input/       # Input handling
│   │   │   ├── movement/    # Movement & pathfinding
│   │   │   ├── network/     # WebSocket client
│   │   │   ├── rendering/   # Canvas rendering
│   │   │   ├── scenes/      # Game scenes
│   │   │   └── state/       # State management
│   │   └── __tests__/       # Client tests
│   │
│   └── server/          # Backend (Node.js + Express)
│       ├── src/
│       │   ├── config/      # Configuration
│       │   ├── database/    # Database & migrations
│       │   ├── infrastructure/  # Redis, WebSocket
│       │   ├── middleware/  # Auth, rate limiting
│       │   ├── presentation/    # WebSocket handlers
│       │   ├── repositories/    # Data access
│       │   └── services/    # Business logic
│       └── __tests__/       # Server tests
│
└── .kiro/               # Team documentation
    ├── steering/        # Standards & guidelines
    └── docs/            # Reports & plans
```

### Key Technologies

**Frontend:**
- TypeScript
- Webpack (bundling)
- Canvas API (rendering)
- WebSocket (real-time communication)

**Backend:**
- Node.js + Express
- PostgreSQL (database)
- Redis (caching, rate limiting)
- WebSocket (real-time communication)
- JWT (authentication)

**Testing:**
- Jest (unit & integration tests)
- 80%+ coverage requirement

**DevOps:**
- Git (version control)
- GitHub Actions (CI/CD)
- Docker (local development)
- AWS (production - access pending)

---

## Day 4-5: First Tasks

### Task 1: Fix a Small Bug
- Check GitHub issues labeled "good first issue"
- Read the code involved
- Write a test that reproduces the bug
- Fix the bug
- Submit PR

### Task 2: Add a Test
- Find code with <80% coverage
- Write unit tests
- Submit PR

### Task 3: Implement a Small Feature
- Pick a feature from backlog
- Discuss approach with team
- Implement with tests
- Submit PR

---

## Week 2: Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/TICKET-123-short-description

# Make changes
git add .
git commit -m "feat(module): description"

# Push and create PR
git push origin feature/TICKET-123-short-description
```

### Commit Message Format
```
[type](scope): message

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example: feat(auth): add JWT token refresh mechanism
```

### Pull Request Process
1. Create PR with clear description
2. Self-review your code
3. Request review from Developer (non-architecture) or Tech Lead (architecture)
4. Address feedback
5. Merge when approved

### Code Review
- You'll review PRs from other developers
- Follow [Code Review Guidelines](.kiro/docs/improvement-plan/code-review-guidelines.md)
- Be constructive and specific

---

## Week 3: Architecture & Patterns

### Layered Architecture
```
Presentation → Services → Repositories → Database
```

**Presentation Layer:**
- WebSocket handlers
- Request/response formatting
- Input validation

**Service Layer:**
- Business logic
- Workflows
- Transaction management

**Repository Layer:**
- Database queries
- Data mapping
- Caching

### Common Patterns

**Service Pattern:**
```typescript
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    // Validate
    // Business logic
    // Save to database
    // Send email
    return user;
  }
}
```

**Repository Pattern:**
```typescript
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}
```

---

## Week 4: Testing

### Unit Tests
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'Pass123!' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('Pass123!'); // Should be hashed
    });
  });
});
```

### Integration Tests
```typescript
describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Pass123!' });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test -- UserService.test.ts
```

---

## Common Tasks

### Adding a New API Endpoint
1. Create handler in `presentation/websocket-handlers.ts`
2. Add service method in `services/`
3. Add repository method if needed in `repositories/`
4. Write tests
5. Update API documentation

### Database Migration
```bash
# Create migration
npm run db:create-migration migration_name

# Edit migration files in src/database/migrations/

# Run migration
npm run db:migrate

# Rollback if needed
npm run db:rollback
```

### Adding a New Feature
1. Discuss with team (architecture implications?)
2. Create feature branch
3. Implement with tests (TDD recommended)
4. Update documentation
5. Submit PR
6. Address review feedback
7. Merge and deploy

---

## Resources

### Documentation
- [Dev Team Standards](.kiro/steering/dev-team-standards.md)
- [Architecture Guidelines](.kiro/steering/architecture-guidelines.md)
- [Security Policies](.kiro/steering/security-policies.md)
- [Code Review Guidelines](.kiro/docs/improvement-plan/code-review-guidelines.md)

### Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Team Communication
- Daily standup: 9:30 AM
- Weekly planning: Monday 10:00 AM
- Knowledge sharing: Friday 2:00 PM
- 1-on-1s: Scheduled individually

---

## Getting Help

### When Stuck
1. Check documentation (steering files, runbooks)
2. Search codebase for similar examples
3. Ask in team chat
4. Schedule pairing session
5. Escalate to Tech Lead if needed

### Pair Programming
- Schedule with any team member
- Great for learning and knowledge transfer
- 20% of your time should be pairing

### Knowledge Sharing Sessions
- Weekly Friday 2:00 PM
- Rotating topics
- Ask questions freely

---

## 30-Day Checklist

### Week 1
- [ ] Environment setup complete
- [ ] Can run project locally
- [ ] Understand project structure
- [ ] Fixed first bug
- [ ] Submitted first PR

### Week 2
- [ ] Comfortable with Git workflow
- [ ] Reviewed someone else's PR
- [ ] Implemented small feature
- [ ] Understand testing approach

### Week 3
- [ ] Understand architecture patterns
- [ ] Can navigate codebase confidently
- [ ] Implemented medium-sized feature
- [ ] Participated in knowledge sharing

### Week 4
- [ ] Fully productive team member
- [ ] Can work independently on most tasks
- [ ] Comfortable reviewing PRs
- [ ] Know when to ask for help

---

## Success Metrics

**After 30 days, you should be able to:**
- Implement features independently
- Review non-architecture PRs
- Write comprehensive tests
- Follow team standards
- Contribute to team discussions
- Help onboard the next developer

---

**Welcome aboard! We're excited to have you on the team.** 🚀

---

**Last Updated:** March 3, 2026  
**Maintained by:** Developer  
**Next Review:** April 3, 2026
