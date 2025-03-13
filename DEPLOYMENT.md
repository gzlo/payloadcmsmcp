# Deployment Guide for Payload CMS MCP

This guide provides instructions for deploying the Payload CMS MCP CLI and SSE Server to GitHub and Vercel, and publishing the package to npm.

## What We've Accomplished

1. **Created a CLI Tool**: A command-line interface for interacting with the Payload CMS MCP server.
2. **Implemented an SSE Server**: A Server-Sent Events server for integration with Cursor IDE.
3. **Designed a Modern UI**: A beautiful and user-friendly interface for the SSE server.
4. **Added Deployment Configuration**: Configuration files for GitHub and Vercel deployment.
5. **Prepared for npm Publishing**: Package configuration for publishing to npm.

## Deployment Steps

### 1. GitHub Deployment

1. Create a new GitHub repository at [github.com/new](https://github.com/new)
2. Initialize the local repository and push to GitHub:

```bash
cd payloadcmsmcp-cli
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Matmax-Worldwide/payloadcmsmcp.git
git push -u origin main
```

### 2. Vercel Deployment

#### Option 1: Using the Vercel CLI

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy to Vercel:

```bash
cd payloadcmsmcp-cli
vercel login
vercel --prod
```

#### Option 2: Using the Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: None
   - Output Directory: None
   - Install Command: npm install
5. Click "Deploy"

### 3. npm Publishing

1. Create an npm account if you don't have one:

```bash
npm adduser
```

2. Publish the package:

```bash
cd payloadcmsmcp-cli
npm publish
```

## Using the Automated Deployment Script

We've created a deployment script that automates the GitHub and Vercel deployment process:

```bash
cd payloadcmsmcp-cli
./deploy.sh
```

The script will:
1. Check for required dependencies
2. Initialize a git repository if needed
3. Add and commit all files
4. Push to GitHub
5. Deploy to Vercel

## After Deployment

Once deployed, you can:

1. **Use the CLI with npx**:

```bash
npx @payloadcmsmcp.info validate ./collections/Posts.js
```

2. **Configure Cursor IDE** to use the SSE endpoint:

```
https://your-vercel-deployment-url.vercel.app/sse
```

3. **Share the URL** with your team for easy access to the Payload CMS MCP tools.

## Troubleshooting

- If you encounter issues with the Vercel deployment, check the Vercel logs for details.
- If the SSE server doesn't start, make sure port 3000 is available or specify a different port.
- For npm publishing issues, ensure you have the correct permissions and that the package name is available. 