#!/bin/bash

# Deploy script for Go Home Tanuki
# This script builds the project and pushes to GitHub Pages

echo "🚀 Deploying Go Home Tanuki to GitHub Pages..."

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch (currently on: $current_branch)"
    echo "   The deployment will trigger when you push to main."
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add all changes
    git add .
    
    # Commit changes
    echo "📝 Committing changes..."
    git commit -m "Deploy: Update game build $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to main branch
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
        echo "🌐 Your game will be available at: https://tanuki.joekarlsson.com/"
        echo "⏳ GitHub Actions will automatically deploy the changes in a few minutes."
    else
        echo "❌ Failed to push to GitHub"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
