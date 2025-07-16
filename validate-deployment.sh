#!/bin/bash

# Deployment validation script
# Validates that all deployment files are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${NC}[i]${NC} $1"
}

echo "=== Coolify Deployment Validation ==="
echo ""

# Check if required files exist
echo "Checking required files..."

required_files=(
    "Dockerfile"
    "docker-compose.yml"
    ".github/workflows/deploy.yml"
    "package.json"
    "pnpm-lock.yaml"
    "COOLIFY.md"
    "DEPLOYMENT.md"
    ".env.example"
    "deploy.sh"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_status "Found: $file"
    else
        print_error "Missing: $file"
        exit 1
    fi
done

echo ""
echo "Checking file contents..."

# Check Dockerfile
if grep -q "ENV PORT" Dockerfile; then
    print_status "Dockerfile allows configurable PORT"
else
    print_warning "Dockerfile does not include configurable PORT"
fi

# Check that Dockerfile has proper EXPOSE
if grep -q "^EXPOSE 3000" Dockerfile; then
    print_status "Dockerfile exposes port 3000"
else
    print_warning "Dockerfile should expose port 3000"
fi

if grep -q "HEALTHCHECK" Dockerfile; then
    print_status "Dockerfile includes health check"
else
    print_warning "Dockerfile does not include health check"
fi

# Check docker-compose.yml
if grep -q "ports:" docker-compose.yml; then
    print_status "docker-compose.yml includes port mapping"
else
    print_error "docker-compose.yml does not include port mapping"
fi

# Check that health check uses internal port 3000
if grep -q "localhost:3000" docker-compose.yml; then
    print_status "docker-compose.yml health check uses internal port 3000"
else
    print_warning "docker-compose.yml health check should use port 3000"
fi

# Check GitHub Actions workflow
if grep -q "COOLIFY_WEBHOOK_URL" .github/workflows/deploy.yml; then
    print_status "GitHub Actions workflow includes Coolify webhook"
else
    print_error "GitHub Actions workflow missing Coolify webhook"
fi

# Check package.json scripts
if grep -q '"start"' package.json; then
    print_status "package.json includes start script"
else
    print_error "package.json missing start script"
fi

if grep -q '"build"' package.json; then
    print_status "package.json includes build script"
else
    print_error "package.json missing build script"
fi

echo ""
echo "Checking environment configuration..."

# Check .env.example
if [[ -f ".env.example" ]]; then
    if grep -q "NODE_ENV=production" .env.example; then
        print_status ".env.example includes NODE_ENV"
    else
        print_warning ".env.example missing NODE_ENV"
    fi
    
    if grep -q "PORT=3000" .env.example; then
        print_status ".env.example includes PORT"
    else
        print_warning ".env.example missing PORT"
    fi
fi

echo ""
echo "=== Validation Complete ==="
echo ""
print_info "Next steps:"
print_info "1. Add GitHub secrets: COOLIFY_WEBHOOK_URL and COOLIFY_TOKEN"
print_info "2. Configure Coolify project with Docker Compose or Dockerfile"
print_info "3. Set environment variables in Coolify"
print_info "4. Deploy via GitHub Actions or manual trigger"
echo ""
print_info "For detailed instructions, see DEPLOYMENT.md"