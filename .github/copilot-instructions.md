# Sweet Shop Management System - AI Coding Instructions

## Project Overview
A TDD-driven full-stack sweet shop management system with authentication, inventory management, and a modern SaaS-style UI.

**Tech Stack:**
- Backend: Node.js + TypeScript + Express + MongoDB (Mongoose)
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Testing: Jest + Supertest (backend), Vitest (frontend)
- State: Zustand + React Query

## Project Structure
```
/backend - Express API server
  /src
    /config - Database & environment config
    /models - Mongoose schemas
    /controllers - Route handlers
    /middleware - Auth, validation, error handling
    /routes - API endpoints
    /services - Business logic
    /tests - Jest test files
/frontend - React SPA
  /src
    /components - Reusable UI components (shadcn/ui)
    /pages - Route pages
    /hooks - Custom React hooks
    /services - API client
    /store - Zustand stores
    /lib - Utilities
```

## Development Workflow

### TDD Red-Green-Refactor Pattern
**Always follow this order:**
1. Write failing test first (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor and commit (REFACTOR)

**Example for a new endpoint:**
```bash
# 1. Create test file first
backend/src/tests/auth.test.ts

# 2. Write failing test
# 3. Run: npm test (should fail)
# 4. Implement feature
# 5. Run: npm test (should pass)
# 6. Refactor code
# 7. Commit with AI co-author
```

### Git Commit Messages
**All commits must include AI co-author when AI was used:**
```bash
git commit -m "feat: Add user registration endpoint

Used GitHub Copilot to generate initial controller boilerplate.
Manually added validation logic and error handling.

Co-authored-by: GitHub Copilot <copilot@github.com>"
```

### Running the Application
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Tests
cd backend && npm run test:watch
```

## Key Conventions

### Backend API Patterns

**Authentication Middleware:**
- All protected routes use `authMiddleware` 
- Admin routes use `authMiddleware + adminMiddleware`
- JWT tokens in `Authorization: Bearer <token>` header

**Error Handling:**
- Use consistent error response format:
```typescript
res.status(400).json({ error: { message: 'Validation failed' } })
```

**Mongoose Models:**
- Use TypeScript interfaces + Mongoose schemas
- Enable timestamps: `{ timestamps: true }`
- Index commonly queried fields

**Testing:**
- Use `mongodb-memory-server` for isolated tests
- Clean database after each test (in `tests/setup.ts`)
- Test both success and error cases

### Frontend Patterns

**Component Structure:**
- Use shadcn/ui components as base (Button, Card, Input, etc.)
- Keep components in `/components/ui` for shadcn
- Custom components in `/components` (e.g., SweetCard, Navbar)

**API Calls:**
- Use React Query for data fetching
- Create service functions in `/services/api.ts`
- Handle loading and error states consistently

**Styling:**
- Use Tailwind utility classes
- Follow shadcn/ui design system (CSS variables in `index.css`)
- Modern SaaS aesthetic: clean, spacious, rounded corners

**State Management:**
- Auth state in Zustand (`useAuthStore`)
- Server state in React Query
- Local UI state in component useState

## Critical Files

- [backend/src/server.ts](backend/src/server.ts) - Express app setup
- [backend/src/config/database.ts](backend/src/config/database.ts) - MongoDB connection
- [backend/src/tests/setup.ts](backend/src/tests/setup.ts) - Test configuration
- [frontend/src/main.tsx](frontend/src/main.tsx) - React app entry
- [frontend/src/index.css](frontend/src/index.css) - Tailwind + design tokens
- [frontend/tailwind.config.js](frontend/tailwind.config.js) - Tailwind configuration

## API Endpoints (To Be Implemented)

### Auth (Phase 2)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Sweets (Phase 3)
- `GET /api/sweets` - List all sweets
- `GET /api/sweets/search?q=&category=&minPrice=&maxPrice=` - Search sweets
- `POST /api/sweets` - Create sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)

### Inventory (Phase 4)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

## MongoDB Schema Reference

**User Model:**
- email, password (hashed), role (user/admin), timestamps

**Sweet Model:**
- name, category, price, quantity, description, imageUrl, timestamps

## Dependencies to Know

**Backend:**
- `express-validator` - Request validation
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT generation/verification

**Frontend:**
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management  
- `lucide-react` - Icons
- `axios` - HTTP client

## Testing Guidelines

- Aim for >70% code coverage
- Test all edge cases (empty inputs, invalid tokens, out of stock, etc.)
- Use descriptive test names: `it('should return 401 when token is invalid')`
- Group related tests with `describe` blocks

## Common Pitfalls to Avoid

1. **Don't skip tests** - Always write tests first (TDD)
2. **Don't commit without AI attribution** - If AI helped, add co-author
3. **Don't use plain passwords** - Always hash with bcrypt
4. **Don't skip input validation** - Use express-validator
5. **Don't hardcode values** - Use environment variables
6. **Don't forget error handling** - Every async operation needs try/catch

## Next Phase: Phase 2 - Backend Foundation (TDD)
Start by creating User model and authentication endpoints following TDD.
