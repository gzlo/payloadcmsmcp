#!/bin/bash

# Deployment script for Payload CMS MCP CLI & Server

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Payload CMS MCP Deployment Script${NC}"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git and try again.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Warning: Vercel CLI is not installed. Installing...${NC}"
    npm install -g vercel
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
fi

# Add all files to git
echo -e "${YELLOW}Adding files to git...${NC}"
git add .
echo -e "${GREEN}Files added to git.${NC}"

# Commit changes
echo -e "${YELLOW}Committing changes...${NC}"
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"
echo -e "${GREEN}Changes committed.${NC}"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
read -p "Enter GitHub repository URL (e.g., https://github.com/username/repo.git): " github_url

# Check if remote origin exists
if git remote | grep -q "origin"; then
    git remote set-url origin "$github_url"
else
    git remote add origin "$github_url"
fi

git push -u origin main || git push -u origin master
echo -e "${GREEN}Changes pushed to GitHub.${NC}"

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod
echo -e "${GREEN}Deployment to Vercel completed.${NC}"

echo ""
echo -e "${GREEN}Deployment process completed successfully!${NC}"
echo "========================================"
echo "Next steps:"
echo "1. Configure your Cursor IDE to use the SSE endpoint"
echo "2. Test the CLI with: npx @payloadcmsmcp.info validate ./collections/Posts.js"
echo "3. Share the URL with your team"
echo "" 