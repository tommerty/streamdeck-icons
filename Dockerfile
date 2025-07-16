# Use Node.js 22 image with pnpm pre-installed
FROM node:22-alpine AS base
RUN corepack enable pnpm

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build the app
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production image
FROM base AS runner
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
# PORT is now configurable via environment variables (default: 3000)
ENV PORT=3000

# The port is dynamically exposed based on the PORT environment variable
# No hard-coded EXPOSE directive - let the runtime handle port binding

CMD ["pnpm", "start"]
