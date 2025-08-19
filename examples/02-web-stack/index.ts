/**
 * Todo Web Stack Example
 *
 * This example demonstrates a complete todo application:
 * - PostgreSQL database
 * - Bun API backend with native PostgreSQL client
 * - React frontend served by Bun's bundler
 * - Traefik reverse proxy for routing
 * - Private and public networks
 * - Bind mounts for live development
 */

import alchemy from "alchemy";
import { Container, Image, Mount, Network, Volume } from "alchemy/docker/v2";
import { resolve } from "node:path";

const app = await alchemy("web-stack-example");

// Create networks
const publicNetwork = await Network("public");
const privateNetwork = await Network("private", {
  internal: true, // Database not accessible from outside
});

// PostgreSQL database
const database = await Container("database", {
  image: await Image("postgres.img", { ref: "postgres:16-alpine" }),
  status: "running",
  environment: {
    POSTGRES_USER: "appuser",
    POSTGRES_PASSWORD: "secretpassword",
    POSTGRES_DB: "appdb",
  },
  volumes: {
    "/var/lib/postgresql/data": await Volume("postgres-data"),
  },
  networking: {
    [privateNetwork.Name]: {},
  },
  healthcheck: {
    test: "pg_isready -U appuser",
    interval: "10s",
    timeout: "5s",
    retries: 5,
  },
});

const backend = await Container("backend", {
  image: await Image("backend.img", {
    ref: "ghcr.io/msanchezdev/alchemy-sandbox/examples/02-web-stack/api:1.0.0",
    build: {
      context: resolve(import.meta.dir, "api"),
    },
  }),
  status: "running",
  environment: {
    DATABASE_URL: `postgresql://appuser:secretpassword@${database.Name}:5432/appdb`,
  },
  networking: {
    [privateNetwork.Name]: {}, // Access to database
  },
  labels: {
    "traefik.enable": "true",
    "traefik.http.routers.backend.rule": "PathPrefix(`/api`)",
    "traefik.http.routers.backend.entrypoints": "web",
    "traefik.http.middlewares.backend-stripprefix.stripprefix.prefixes": "/api",
    "traefik.http.routers.backend.middlewares": "backend-stripprefix",
    "traefik.http.services.backend.loadbalancer.server.port": "3000",
  },
  restart: "unless-stopped",
});

const frontend = await Container("frontend", {
  image: await Image("frontend.img", {
    ref: "ghcr.io/msanchezdev/alchemy-sandbox/examples/02-web-stack/frontend:1.0.0",
    build: {
      context: resolve(import.meta.dir, "frontend"),
    },
  }),
  status: "running",
  networking: {
    [privateNetwork.Name]: {},
  },
  labels: {
    "traefik.enable": "true",
    "traefik.http.routers.frontend.rule": "PathPrefix(`/`)",
    "traefik.http.routers.frontend.entrypoints": "web",
    "traefik.http.routers.frontend.priority": "1",
    "traefik.http.services.frontend.loadbalancer.server.port": "3001",
  },
  restart: "unless-stopped",
});

// Traefik reverse proxy
const traefik = await Container("traefik", {
  image: await Image("traefik.img", {
    ref: "traefik:v3.2",
    pull: "always",
  }),
  status: "running",
  command: [
    "--api.insecure=true",
    "--providers.docker=true",
    "--providers.docker.exposedbydefault=false",
    "--entrypoints.web.address=:80",
    "--log.level=INFO",
  ],
  ports: {
    80: 8080, // Main web port
    8080: 8081, // Traefik dashboard
  },
  networking: {
    [publicNetwork.Name]: {},
    [privateNetwork.Name]: {},
  },
  volumes: {
    "/var/run/docker.sock": Mount.Bind("/var/run/docker.sock"),
  },
  restart: "unless-stopped",
});

await app.finalize();

console.log(`
✅ Todo app is ready!

Access the app at:
  - Application:      http://localhost:8080
  - Frontend:         http://localhost:8080/
  - API:              http://localhost:8080/api
  - Traefik Dashboard: http://localhost:8081

Routing:
  / → Frontend (React app)
  /api → Backend (strips /api prefix)
`);
