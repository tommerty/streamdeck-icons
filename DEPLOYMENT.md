# Coolify Deployment Guide

This guide will help you deploy the Stream Deck Icons application to Coolify.

## Prerequisites

- Coolify instance running and accessible
- GitHub repository with the Stream Deck Icons code
- Admin access to your GitHub repository (for setting secrets)

## Step 1: Setup GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and Variables > Actions
3. Add the following secrets:
   - `COOLIFY_WEBHOOK_URL`: Your Coolify webhook URL (get from Coolify project settings)
   - `COOLIFY_TOKEN`: Your Coolify API token (optional, for enhanced security)

## Step 2: Create Coolify Project

1. Log into your Coolify instance
2. Create a new project
3. Choose "Git Repository" as the source
4. Connect your GitHub repository

## Step 3: Configure Deployment

### Option A: Using Docker Compose (Recommended)
1. In Coolify, select "Docker Compose" as the deployment method
2. Use the provided `docker-compose.yml` file
3. Set the build context to the repository root

### Option B: Using Dockerfile
1. In Coolify, select "Dockerfile" as the deployment method
2. Use the provided `Dockerfile`
3. Set the build context to the repository root

## Step 4: Environment Configuration

Set the following environment variables in Coolify:
- `NODE_ENV=production`
- `PORT=<your-preferred-port>` (e.g., `PORT=3009` if port 3000 is occupied)

## Step 5: Build Settings

Configure the following in Coolify:
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Port**: Set to match your PORT environment variable (e.g., 3009)
- **Health Check Path**: `/`

## Step 6: Deploy

### Automatic Deployment (Recommended)
- Push changes to the `main` branch
- GitHub Actions will automatically trigger deployment

### Manual Deployment
- Use the Coolify dashboard to manually trigger deployment
- Or use the webhook URL directly

## Troubleshooting

### Common Issues

1. **Build fails with pnpm not found**
   - Ensure the Dockerfile is being used correctly
   - Check that Node.js 22 is available

2. **Health check fails**
   - Verify the application is running on the configured PORT
   - Check application logs in Coolify
   - Ensure PORT environment variable is set correctly

3. **GitHub Actions deployment fails**
   - Verify webhook URL and token are correctly set
   - Check GitHub Actions logs for specific errors

### Logs

To view logs:
1. Go to your Coolify project
2. Navigate to the "Logs" tab
3. Check both build and runtime logs

## Additional Configuration

### Custom Domain
1. In Coolify, go to your project settings
2. Add your custom domain in the "Domains" section
3. Configure SSL certificate (automatic with Let's Encrypt)

### Resource Limits
- **Memory**: 512MB minimum (1GB recommended)
- **CPU**: 1 core minimum
- **Storage**: 2GB minimum

## Support

If you encounter issues:
1. Check the Coolify documentation
2. Review the application logs
3. Verify all environment variables are set correctly
4. Ensure the webhook URL is correct and accessible