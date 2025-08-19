# Todo Web Stack Example

A complete full-stack todo application with Traefik reverse proxy, demonstrating modern web development with Bun.

## Architecture

```
┌─────────────┐
│   Browser   │ http://localhost:8080
└──────┬──────┘
       │
┌──────▼──────────┐  Public Network
│     Traefik     │  Reverse Proxy
│   Port 8080     │  / → frontend
└─────┬─────┬─────┘  /api → backend (strip prefix)
      │     │
      │     └─────────┐
      │               │
┌─────▼─────┐  ┌─────▼─────┐
│ Frontend  │  │  Backend  │  Private Network
│  (Bun)    │  │   (Bun)   │◄────────────┐
│  React    │  │  REST API │             │
└───────────┘  └─────┬─────┘      ┌──────▼──────┐
                     │            │  PostgreSQL │
                     └───────────►│  Database   │
                                  └─────────────┘
```

## Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS v4
- **Backend**: Bun REST API with native routing and Bun.sql
- **Database**: PostgreSQL 16
- **Reverse Proxy**: Traefik v3.2 with automatic service discovery
- **Networks**: Public (all services) + Private (backend/database isolation)

## Features

### Traefik Reverse Proxy
- Automatic service discovery via Docker labels
- Path-based routing (/ and /api)
- Strip prefix middleware for API routes
- Dashboard available at port 8081
- No CORS issues - single origin

### API (`api/index.ts`)
- Bun's native HTTP routing
- Bun.sql for PostgreSQL (zero dependencies)
- CRUD operations for todos
- Health checks
- Automatic TypeScript/JSX transpilation

**Endpoints (via Traefik at `/api`):**
- `GET /api` - API info
- `GET /api/health` - Health check
- `GET /api/todos` - List all todos
- `POST /api/todos` - Create todo
- `PATCH /api/todos/:id` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo

### Frontend (`frontend/`)
- React 18 with functional components + hooks
- TypeScript for type safety
- Tailwind CSS v4 via bun-plugin-tailwind
- Optimistic updates for instant feedback
- Server-side bundling with Bun's fullstack server

## Running the Example

```bash
cd examples/02-web-stack
bun run index.ts
```

The app will start four containers:
1. PostgreSQL database (private network only)
2. Backend API (private network - behind Traefik)
3. Frontend server (private network - behind Traefik)
4. Traefik reverse proxy (public + private networks)

### Access Points

- **Application**: http://localhost:8080
- **Frontend**: http://localhost:8080/
- **API**: http://localhost:8080/api
- **Traefik Dashboard**: http://localhost:8081

All traffic goes through Traefik on port 8080!

## Development

The example uses built Docker images (not bind mounts) for a production-like setup.

To develop locally:

**API changes:**
```bash
cd api
bun install
bun run index.ts
# API available at http://localhost:3000
```

**Frontend changes:**
```bash
cd frontend
bun install
bun run dev
# Frontend available at http://localhost:3001
```

For production, rebuild the images:
```bash
# From examples/02-web-stack
bun run index.ts
# Alchemy will rebuild images automatically
```

## Database

The PostgreSQL database is only accessible from the backend (private network isolation).

**Connection:**
```
postgresql://appuser:secretpassword@database:5432/appdb
```

**Schema:**
```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Key Concepts

1. **Reverse Proxy**: Traefik for intelligent routing and service discovery
2. **Network Segmentation**: Database isolated, services communicate privately
3. **Path-Based Routing**: `/` for frontend, `/api` for backend (with prefix stripping)
4. **Container Images**: Production-ready Docker images
5. **Health Checks**: All services monitored for availability
6. **Native APIs**: Bun's built-in features (sql, serve, bundler)
7. **Type Safety**: TypeScript throughout the entire stack
8. **Optimistic Updates**: Instant UI feedback with error rollback
9. **Modern CSS**: Tailwind CSS v4 with automatic processing

## Example Requests

### Via Traefik (Production)

```bash
# Get API info
curl http://localhost:8080/api

# List todos
curl http://localhost:8080/api/todos

# Create todo
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Traefik"}'

# Toggle todo completion
curl -X PATCH http://localhost:8080/api/todos/1

# Delete todo
curl -X DELETE http://localhost:8080/api/todos/1
```

## Traefik Configuration

Routing is configured via Docker labels on containers:

**Backend** (`/api` with prefix stripping):
```typescript
labels: {
  "traefik.enable": "true",
  "traefik.http.routers.backend.rule": "PathPrefix(`/api`)",
  "traefik.http.middlewares.backend-stripprefix.stripprefix.prefixes": "/api",
  "traefik.http.routers.backend.middlewares": "backend-stripprefix",
}
```

**Frontend** (`/` with lowest priority):
```typescript
labels: {
  "traefik.enable": "true",
  "traefik.http.routers.frontend.rule": "PathPrefix(`/`)",
  "traefik.http.routers.frontend.priority": "1",
}
```

## Comparison with Docker Compose

This example includes both:
- **Alchemy** (`index.ts`) - Type-safe infrastructure as code
- **Docker Compose** (`compose.yaml`) - Traditional YAML configuration

See [COMPARISON.md](./COMPARISON.md) for detailed differences.

## Cleanup

```bash
# Stop and remove all containers
docker ps -a | grep web-stack | awk '{print $1}' | xargs docker rm -f

# Remove volumes
docker volume rm $(docker volume ls -q | grep postgres-data)

# Remove networks
docker network rm $(docker network ls -q | grep web-stack)
```