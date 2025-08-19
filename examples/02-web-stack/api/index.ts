/**
 * Simple Todo API - REST API with Bun and PostgreSQL
 *
 * A minimal todo list API demonstrating:
 * - Bun's native HTTP server with routing
 * - Bun.sql for PostgreSQL (built-in, zero dependencies)
 * - Simple CRUD operations
 */

import { serve, sql } from "bun";

// Environment configuration
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://appuser:secretpassword@database:5432/appdb";
const PORT = Number(process.env.PORT) || 3000;

// Database initialization
async function initializeDatabase() {
  console.log("🔄 Initializing database...");

  // Create todos table
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  console.log("✅ Database initialized");

  // Insert sample data if empty
  const count = await sql`SELECT COUNT(*) as count FROM todos`;
  if (count[0].count === "0") {
    console.log("📦 Seeding sample data...");
    await sql`
      INSERT INTO todos (title, completed) VALUES
      ('Buy groceries', false),
      ('Walk the dog', true),
      ('Write documentation', false)
    `;
  }
}

// Helper for JSON responses with CORS
function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Create HTTP server with Bun's routing
const server = serve({
  port: PORT,
  routes: {
    "/": {
      GET() {
        return jsonResponse({
          name: "Todo API",
          version: "1.0.0",
          endpoints: [
            "GET /",
            "GET /health",
            "GET /todos",
            "POST /todos",
            "PATCH /todos/:id",
            "DELETE /todos/:id",
          ],
        });
      },
    },

    "/health": {
      async GET() {
        try {
          await sql`SELECT 1`;
          return jsonResponse({ ok: true });
        } catch (error) {
          return jsonResponse({ ok: false, error: String(error) }, 503);
        }
      },
    },

    "/todos": {
      // Get all todos
      async GET() {
        const todos =
          await sql`SELECT id, title, completed, created_at FROM todos ORDER BY id`;
        return jsonResponse({ todos });
      },

      // Create new todo
      async POST(req) {
        const body = (await req.json()) as { title?: string };

        if (!body.title) {
          return jsonResponse({ error: "Missing title" }, 400);
        }

        const todos = await sql`
          INSERT INTO todos (title)
          VALUES (${body.title})
          RETURNING id, title, completed, created_at
        `;

        return jsonResponse({ todo: todos[0] }, 201);
      },
    },

    "/todos/:id": {
      // Toggle todo completion
      async PATCH(req) {
        const id = Number(req.params.id);

        const todos = await sql`
          UPDATE todos
          SET completed = NOT completed
          WHERE id = ${id}
          RETURNING id, title, completed, created_at
        `;

        if (todos.length === 0) {
          return jsonResponse({ error: "Todo not found" }, 404);
        }

        return jsonResponse({ todo: todos[0] });
      },

      // Delete todo
      async DELETE(req) {
        const id = Number(req.params.id);

        const todos = await sql`
          DELETE FROM todos
          WHERE id = ${id}
          RETURNING id
        `;

        if (todos.length === 0) {
          return jsonResponse({ error: "Todo not found" }, 404);
        }

        return jsonResponse({ deleted: id });
      },
    },
  },

  async fetch(req) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 404 for unmatched routes
    return jsonResponse(
      {
        error: "Not found",
        path: new URL(req.url).pathname,
      },
      404,
    );
  },
});

// Start server
try {
  await initializeDatabase();
  console.log(`🚀 Server running at http://localhost:${server.port}`);
  console.log(`📊 Database: ${DATABASE_URL.split("@")[1]}`);
} catch (error) {
  console.error("❌ Startup error:", error);
  process.exit(1);
}
