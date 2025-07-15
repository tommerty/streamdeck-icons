#!/bin/bash

# Production deployment script for Coolify
# This script can be used to trigger deployment via webhook

set -e

# Configuration
WEBHOOK_URL="${COOLIFY_WEBHOOK_URL:-}"
TOKEN="${COOLIFY_TOKEN:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if webhook URL is set
if [[ -z "$WEBHOOK_URL" ]]; then
    print_error "COOLIFY_WEBHOOK_URL environment variable is not set"
    exit 1
fi

print_status "Starting deployment to Coolify..."

# Prepare the curl command
CURL_CMD="curl -X POST"

# Add authorization header if token is provided
if [[ -n "$TOKEN" ]]; then
    CURL_CMD="$CURL_CMD -H \"Authorization: Bearer $TOKEN\""
fi

# Add content type and data
CURL_CMD="$CURL_CMD -H \"Content-Type: application/json\""
CURL_CMD="$CURL_CMD -d '{\"force\": true}'"
CURL_CMD="$CURL_CMD \"$WEBHOOK_URL\""

# Execute the deployment
print_status "Triggering deployment..."
if eval $CURL_CMD; then
    print_status "Deployment triggered successfully!"
    print_status "Check your Coolify dashboard for deployment status."
else
    print_error "Failed to trigger deployment"
    exit 1
fi