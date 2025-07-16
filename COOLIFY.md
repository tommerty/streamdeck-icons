# Coolify Configuration for Stream Deck Icons

## This app is designed to run on Coolify with the following settings:

### Build Configuration
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Port**: Configurable (defaults to 3000, can be set via PORT environment variable)
- **Docker Build**: Uses the included Dockerfile

### Environment Variables
- `NODE_ENV=production`
- `PORT=<your-preferred-port>` (e.g., `PORT=3009` for port 3009)

### Health Check
- **Path**: `/`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 5

### Docker Compose
The included `docker-compose.yml` can be used for local testing or as a reference for Coolify deployment.

### Resource Requirements
- **Memory**: 512MB minimum (1GB recommended)
- **CPU**: 1 core minimum
- **Storage**: 2GB minimum

### Build Time
- Typical build time: 2-5 minutes
- Build requires Node.js 22 and pnpm

### Notes
- This is a React Router application with SSR
- Uses pnpm as package manager
- Includes health checks for better reliability
- Optimized for production deployment
- Port is fully configurable via environment variables (no hard-coded ports)
- Docker health checks automatically use the configured PORT value