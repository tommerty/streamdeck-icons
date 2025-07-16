# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Coolify Deployment

This project is configured for deployment on [Coolify](https://coolify.io). Follow these steps:

1. **Setup Coolify Project**:
   - Create a new project in your Coolify instance
   - Connect your GitHub repository
   - Select "Docker Compose" as the deployment method

2. **Configure Build Settings**:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Port: Set to match your PORT environment variable (defaults to 3000)
   - Use the included `docker-compose.yml` or `Dockerfile`

3. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=<your-preferred-port>` (e.g., `PORT=3009` if port 3000 is occupied)

4. **GitHub Actions Deployment**:
   - Add the following secrets to your GitHub repository:
     - `COOLIFY_WEBHOOK_URL`: Your Coolify webhook URL
     - `COOLIFY_TOKEN`: Your Coolify API token (optional)
   - The workflow will automatically deploy on pushes to `main`

5. **Health Checks**:
   - The app includes built-in health checks at `/`
   - Coolify will automatically monitor the application

For detailed configuration, see [COOLIFY.md](./COOLIFY.md).

### Docker Deployment

To build and run using Docker:

```bash
docker build -t streamdeck-icons .

# Run the container on port 3000 (default)
docker run -p 3000:3000 streamdeck-icons

# Or run on a custom port (e.g., 3009)
docker run -p 3009:3009 -e PORT=3009 streamdeck-icons
```

Or use Docker Compose:

```bash
docker-compose up -d
```

The containerized application can be deployed to any platform that supports Docker, including:

- Coolify (recommended)
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
