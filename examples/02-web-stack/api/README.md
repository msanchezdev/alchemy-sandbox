# Web Stack API

A simple REST API built with Bun and PostgreSQL, demonstrating modern TypeScript development with native database support.

## Features

- ⚡ **Bun Runtime** - Fast JavaScript/TypeScript runtime with native APIs
- 🗄️ **PostgreSQL** - Bun's built-in SQL client (v1.2+)
- 🔄 **RESTful API** - Clean REST endpoints
- 🏥 **Health Checks** - Built-in health monitoring
- 🔒 **Type Safety** - Full TypeScript support
- 🚀 **Auto Schema** - Automatic database initialization
- 📦 **Zero Dependencies** - Uses only Bun's native APIs

## API Endpoints

### General
- `GET /` - API information and documentation
- `GET /health` - Health check endpoint

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `GET /users/:id/tasks` - Get tasks for a user

### Tasks
- `GET /tasks` - List all tasks
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Toggle task completion

## Example Requests

### Get all users
```bash
curl http://localhost:8080/api/users
```

### Create a user
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Get tasks
```bash
curl http://localhost:8080/api/tasks
```

### Create a task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"title":"Complete the project"}'
```

### Toggle task completion
```bash
curl -X PATCH http://localhost:8080/api/tasks/1
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode (with watch)
bun run dev

# Run in production mode
bun run start
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)

## Tech Stack

- **Runtime**: Bun v1.2+
- **Database**: PostgreSQL 16
- **Language**: TypeScript
- **Client**: Bun.sql (built-in, zero dependencies)

