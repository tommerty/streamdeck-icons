# Coolify Configuration for Stream Deck Icons

## This app is designed to run on Coolify with the following settings:

### Build Configuration
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Port**: Application runs on port 3000 internally
- **Docker Build**: Uses the included Dockerfile

### Environment Variables
- `NODE_ENV=production`
- `PORT=<external-port>` (e.g., `PORT=3009` to expose on port 3009, maps to internal port 3000)

### Port Configuration
- **Internal Port**: Always 3000 (application runs on this port inside the container)
- **External Port**: Configurable via PORT environment variable (defaults to 3000)
- **Example**: Setting `PORT=3009` maps external port 3009 to internal port 3000
- **Avoids Conflicts**: If port 3000 is occupied, set PORT to any available port (e.g., 3009, 8080, etc.)

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
- Application always runs on port 3000 internally
- External port mapping is configurable via PORT environment variable
- Docker health checks use the internal port 3000