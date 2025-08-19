FROM oven/bun:1.3-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Expose frontend port
EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Start frontend server
CMD ["bun", "run", "server.ts"]
