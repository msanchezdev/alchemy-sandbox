/**
 * Frontend Development Server
 *
 * Serves the React app with Bun's fullstack capabilities:
 * - Automatic TypeScript/JSX bundling
 * - Tailwind CSS processing
 * - Hot reloading
 */

import { serve } from "bun";
import indexHtml from "./index.html";

const PORT = Number(process.env.PORT) || 3001;

const server = serve({
  port: PORT,
  routes: {
    "/": indexHtml,
  },
});

console.log(`🎨 Frontend server running at http://localhost:${server.port}`);
console.log(`📦 Bundling: TypeScript + React + Tailwind CSS`);
