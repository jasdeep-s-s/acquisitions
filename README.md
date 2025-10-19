# Acquisitions Application

A Node.js application using Express, Neon Database, and Docker for streamlined development and production deployments.

## 🏗️ Architecture Overview

This application is containerized with Docker and uses different database configurations for development and production:

- **Development**: Uses **Neon Local** proxy for ephemeral database branches
- **Production**: Connects directly to **Neon Cloud Database**

## 📋 Prerequisites

- Docker and Docker Compose installed
- Neon account and project ([Sign up here](https://neon.tech))
- Node.js 18+ (for local development outside Docker)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd acquisitions
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.development

# Edit .env.development with your Neon credentials
# You'll need these from your Neon Console (https://console.neon.tech):
# - NEON_API_KEY
# - NEON_PROJECT_ID  
# - PARENT_BRANCH_ID (usually your main branch ID)
```

### 3. Development Setup (with Neon Local)

```bash
# Start the development environment
docker-compose -f docker-compose.dev.yml up -d

# Check logs
docker-compose -f docker-compose.dev.yml logs -f

# The application will be available at http://localhost:3000
```

### 4. Production Deployment

```bash
# Set your production environment variables
export DATABASE_URL="postgres://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
export JWT_SECRET="your-production-jwt-secret"
export ARCJET_KEY="your-production-arcjet-key"
export CORS_ORIGIN="https://your-domain.com"

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ Development Environment

### How Neon Local Works

The development setup uses **Neon Local**, which creates a local proxy to your Neon database:

1. **Ephemeral Branches**: Each container start creates a fresh database branch
2. **Automatic Cleanup**: Branches are deleted when containers stop
3. **Local Connection**: Your app connects to `neon-local:5432` instead of the cloud
4. **Schema Sync**: Automatically syncs with your main branch schema

### Development Services

- **app**: Your main application (port 3000)
- **neon-local**: Neon Local proxy (port 5432)  
- **adminer**: Database management UI (port 8080) - optional

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Start with database admin UI
docker-compose -f docker-compose.dev.yml --profile tools up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Database Operations

```bash
# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migration
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Open Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## 🚀 Production Environment

### Environment Variables

Production requires these environment variables to be set:

```bash
# Database
DATABASE_URL=postgres://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require

# Security  
JWT_SECRET=your-strong-jwt-secret-here
SESSION_SECRET=your-strong-session-secret-here

# Services
ARCJET_KEY=your-production-arcjet-key

# Application
CORS_ORIGIN=https://your-domain.com
PORT=3000
NODE_ENV=production
```

### Production Services

- **app**: Main application with resource limits
- **log-shipper**: Centralized logging (optional)
- **nginx**: Reverse proxy and load balancer (optional)

```bash
# Deploy production stack
docker-compose -f docker-compose.prod.yml up -d

# Deploy with monitoring
docker-compose -f docker-compose.prod.yml --profile monitoring up -d

# Deploy with reverse proxy
docker-compose -f docker-compose.prod.yml --profile proxy up -d

# Scale the application
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## 📁 Project Structure

```
acquisitions/
├── src/                    # Application source code
├── drizzle/               # Database migrations and schema
├── logs/                  # Application logs (mounted volume)
├── .neon_local/          # Neon Local metadata (auto-created)
├── docker-compose.dev.yml # Development environment
├── docker-compose.prod.yml# Production environment  
├── Dockerfile            # Multi-stage application container
├── .env.development      # Development environment variables
├── .env.production       # Production environment template
├── .env.example          # Environment variables template
└── README.md            # This file
```

## 🔧 Configuration Details

### Neon Local Configuration

The development environment uses these Neon Local settings:

- **NEON_API_KEY**: Your Neon API key
- **NEON_PROJECT_ID**: Your Neon project ID
- **PARENT_BRANCH_ID**: The branch to create ephemeral branches from
- **DELETE_BRANCH**: `true` (branches deleted on container stop)

### Database Connection Strings

#### Development (Neon Local)
```
postgres://neon:npg@neon-local:5432/neondb?sslmode=require
```

#### Production (Neon Cloud)
```  
postgres://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## 🏥 Health Checks and Monitoring

Both environments include health checks:

```bash
# Check application health
curl http://localhost:3000/health

# View container health status
docker ps
```

## 🐛 Troubleshooting

### Common Issues

#### Neon Local Connection Issues
```bash
# Check Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables
docker-compose -f docker-compose.dev.yml exec neon-local env | grep NEON
```

#### Database Connection Problems
```bash
# Test connection to Neon Local
docker-compose -f docker-compose.dev.yml exec app node -e "
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
client.connect().then(() => console.log('Connected!')).catch(console.error);
"
```

#### Container Build Issues
```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml build --no-cache

# View build logs
docker-compose -f docker-compose.dev.yml build --progress=plain
```

### Logs and Debugging

```bash
# Application logs
docker-compose -f docker-compose.dev.yml logs -f app

# Database proxy logs
docker-compose -f docker-compose.dev.yml logs -f neon-local

# All services logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🔒 Security Notes

- Never commit real environment variables to version control
- Use strong, unique secrets in production
- The application runs as non-root user in containers
- SSL/TLS is required for Neon database connections
- Rate limiting is configured for production

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both development and production configurations
5. Submit a pull request

## 📄 License

[Your License Here]