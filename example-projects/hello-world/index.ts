import * as os from "node:os";

Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",
  async fetch(req) {
    console.log(`${req.method} ${req.url}`);
    return Response.json({
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: os.uptime(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      cpus: os.cpus(),
    });
  },
});

console.log("Server is running on port 3000");
