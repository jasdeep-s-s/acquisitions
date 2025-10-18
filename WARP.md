# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with file watching (uses Node.js --watch flag)
- `npm run lint` - Run ESLint on the entire codebase
- `npm run lint:fix` - Run ESLint with auto-fixing enabled
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to database
- `npm run db:studio` - Open Drizzle Studio for database management

### Environment Setup
- Copy `.env.example` to `.env` and configure:
  - `DATABASE_URL` - Neon PostgreSQL connection string
  - `PORT` - Server port (defaults to 3000)
  - `NODE_ENV` - Environment (development/production)
  - `LOG_LEVEL` - Winston log level (defaults to 'info')
  - `JWT_SECRET` - JWT signing secret (change from default in production)

## Architecture Overview

### Project Structure
This is a Node.js Express API with a modular architecture using ES6 modules and path imports:

- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: PostgreSQL via Neon with Drizzle ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Validation**: Zod schemas for request validation
- **Logging**: Winston with file and console transports

### Key Architectural Patterns

#### Path Import Aliases
The project uses import maps (defined in `package.json`) for clean imports:
```javascript
#config/* → ./src/config/*
#controllers/* → ./src/controllers/*
#middleware/* → ./src/middleware/*
#models/* → ./src/models/*
#routes/* → ./src/routes/*
#services/* → ./src/services/*
#utils/* → ./src/utils/*
#validations/* → ./src/validations/*
```

#### Layered Architecture
1. **Routes** (`src/routes/`) - Define API endpoints and route handlers
2. **Controllers** (`src/controllers/`) - Handle request/response logic and validation
3. **Services** (`src/services/`) - Business logic and database interactions
4. **Models** (`src/models/`) - Drizzle ORM schema definitions
5. **Utils** (`src/utils/`) - Reusable utility functions (JWT, cookies, formatting)
6. **Validations** (`src/validations/`) - Zod validation schemas

#### Database Layer
- **ORM**: Drizzle with Neon PostgreSQL serverless driver
- **Migrations**: Drizzle Kit manages schema migrations in `./drizzle/` directory
- **Connection**: Database connection configured in `src/config/database.js`

#### Authentication Flow
- User registration via `/api/auth/sign-up` with Zod validation
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens issued and stored in HTTP-only cookies
- Cookie security settings adjust based on NODE_ENV

### Current Implementation Status
- ✅ User registration endpoint with full validation and database integration
- ✅ Logging infrastructure with file and console output
- ✅ Database schema for users table with Drizzle ORM
- 🔄 Sign-in and sign-out endpoints are placeholder implementations
- 🔄 No authentication middleware for protected routes yet

### Code Style & Standards
- ES6 modules with `"type": "module"` in package.json
- ESLint configuration enforces:
  - 2-space indentation
  - Single quotes
  - Semicolons required
  - Prefer const/arrow functions
  - Unix line endings
- Prettier for consistent formatting
- File extensions required in imports (`.js`)

### Testing Setup
ESLint is configured for test globals (describe, it, expect, etc.) but no test framework is currently implemented.

### Important Development Notes
- The project uses `node --watch` for development hot-reloading
- Logs are written to `logs/error.log` and `logs/combined.log`
- Database URL must be configured before running database commands
- JWT secret should be changed from default in production environments