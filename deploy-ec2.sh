#!/bin/bash

# JAM Application Deployment Script for EC2 (IP Access)
set -e

echo "🚀 Starting JAM Application Deployment..."

# Pull latest changes
echo "📥 Pulling latest changes from dev branch..."
git pull origin dev

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2 processes
echo "🔄 Restarting application..."
pm2 restart jam-app || pm2 start "npm run preview -- --host 0.0.0.0 --port 3000" --name "jam-app"

# Check application status
echo "✅ Checking application status..."
pm2 status

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is running at: http://$PUBLIC_IP:3000"
echo "📊 Students can access JAM tests at: http://$PUBLIC_IP:3000"