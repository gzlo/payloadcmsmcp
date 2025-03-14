# 🚀 Payload CMS MCP SERVER

<div align="center">
  <img src="https://github.com/payloadcms/payload/raw/main/packages/payload/src/admin/assets/images/payload-logo-light.svg" alt="Payload CMS Logo" width="180" />
  <br>
  <br>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Model%20Context%20Protocol-Enabled-6366F1?style=for-the-badge" alt="MCP Enabled" />
    <img src="https://img.shields.io/badge/Payload%20CMS-Integration-3B82F6?style=for-the-badge" alt="Payload CMS" />
    <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Railway-Deployment-0B0D0E?style=for-the-badge" alt="Railway Deployment" />
  </p>
  
  <h3>Enhance your Payload CMS development experience with natural language commands</h3>
  <p>Build, deploy, and manage your content infrastructure through conversational AI</p>
</div>

<hr>

## 📋 Overview

The Payload CMS MCP Server enables you to manage Payload CMS projects with simple natural language commands. It helps developers build better Payload CMS applications by providing a conversational interface for project management, content modeling, and deployment automation.

<hr>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>✅</h3>
        <b>Payload CMS Project Management</b>
        <p>Create, configure, and manage your Payload CMS projects with simple natural language commands</p>
      </td>
      <td align="center">
        <h3>🚀</h3>
        <b>Content Modeling</b>
        <p>Define collections, fields, and relationships for your Payload CMS content models through conversation</p>
      </td>
      <td align="center">
        <h3>🔄</h3>
        <b>Deployment Automation</b>
        <p>Automate Payload CMS deployments, monitor status, and troubleshoot issues with AI assistance</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <h3>🔑</h3>
        <b>Authentication & Access Control</b>
        <p>Configure users, roles, and permissions for your Payload CMS projects with natural language</p>
      </td>
      <td align="center">
        <h3>🌐</h3>
        <b>API & Integration Management</b>
        <p>Set up and manage Payload CMS APIs, webhooks, and third-party integrations effortlessly</p>
      </td>
      <td align="center">
        <h3>💾</h3>
        <b>Database & Media Management</b>
        <p>Configure databases, media storage, and backups for your Payload CMS projects with ease</p>
      </td>
    </tr>
  </table>
</div>

<hr>

## 🔧 Available Tools

### Project Tools

Manage your Railway projects with these tools:

* `project-list` - List all projects
* `project-info` - Get project details
* `project-create` - Create a new project
* `project-delete` - Delete a project
* `project-environments` - List environments

### Service Tools

Deploy and manage services:

* `service-list` - List all services
* `service-info` - Get service details
* `service-create-from-repo` - Create from GitHub
* `service-create-from-image` - Create from Docker
* `service-delete` - Delete a service
* `service-restart` - Restart a service

### Deployment Tools

Manage your deployments:

* `deployment-list` - List deployments
* `deployment-trigger` - Trigger a deployment
* `deployment-logs` - View deployment logs
* `deployment-health-check` - Check status

### Variable Tools

Manage environment variables:

* `variable-list` - List variables
* `variable-set` - Create/update variables
* `variable-delete` - Delete variables
* `variable-bulk-set` - Bulk update variables
* `variable-copy` - Copy between environments

### Database Tools

Deploy and manage databases:

* `database-list-types` - List available types
* `database-deploy` - Deploy a new database

### Network Tools

Configure networking:

* `domain-list` - List domains
* `domain-create` - Create a domain
* `tcp-proxy-list` - List TCP proxies
* `tcp-proxy-create` - Create a TCP proxy

<hr>

## 🚀 Getting Started

### 1. Prerequisites

Before you begin, make sure you have:

* Node.js 18+ (for built-in fetch API support)
* An active Railway account
* A Railway API token (create one at [https://railway.app/account/tokens](https://railway.app/account/tokens))

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Matmax-Worldwide/payloadcmsmcp.git
cd payloadcmsmcp
npm install
```

Run the server with your Railway API token:

```bash
node server.js YOUR_RAILWAY_API_TOKEN
```

### 3. Configure Cursor

To use with Cursor IDE:

1. Open Cursor Settings
2. Go to MCP Servers section
3. Add a new MCP server
4. Name it "Payload CMS MCP"
5. Set Transport Type to "Command"
6. Set Command to: `node /path/to/payloadcmsmcp/server.js YOUR_RAILWAY_API_TOKEN`
7. Save the configuration

### 4. Configure Claude for Desktop

To use with Claude for Desktop:

1. Edit your Claude for Desktop config file:
   * macOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
   * Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add this configuration:
   ```json
   "mcpServers": {
     "payloadcms": {
       "command": "node",
       "args": ["/path/to/payloadcmsmcp/server.js", "YOUR_RAILWAY_API_TOKEN"],
       "env": {}
     }
   }
   ```
3. Restart Claude for Desktop

### 5. Start Using

Once configured, you can use natural language to manage your Payload CMS projects:

* "Create a new Payload CMS project with MongoDB"
* "Set up a blog collection with title, content, and author fields"
* "Configure authentication with email and password"
* "Deploy my Payload CMS project to Railway"

<hr>

## 🚀 Deployment

### Railway Deployment

To deploy this MCP server to Railway:

1. **Create a new Railway project**:
   * Go to [Railway.app](https://railway.app) and create a new project
   * Choose "Deploy from GitHub repo" and select your repository

2. **Configure environment variables**:
   * Add any necessary environment variables in the Railway dashboard
   * For Redis connection (if needed), add your Redis connection string

3. **Deploy your application**:
   * Railway will automatically deploy your application
   * You can monitor the deployment in the Railway dashboard

4. **Access your deployed application**:
   * Railway will provide a URL for your deployed application
   * You can also configure a custom domain in the Railway dashboard

<hr>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<hr>

## 🌍 About MATMAX WORLDWIDE

<div align="center">
  <h3>MATMAX WORLDWIDE</h3>
  <p>Creating technology that helps humans be more human.</p>
</div>

This MCP server is a contribution to the Payload CMS community by MATMAX WORLDWIDE. We believe in tech for good—tools that enhance our lives while respecting our humanity.

Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.

Our Payload CMS MCP Server bridges the gap between content management and AI, enabling developers to build powerful, flexible applications with natural language commands.

Visit [matmax.world](https://matmax.world) to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation.

<div align="center">
  <p>
    <a href="https://github.com/Matmax-Worldwide" target="_blank">GitHub</a> •
    <a href="https://www.linkedin.com/company/the-wellness-brand" target="_blank">LinkedIn</a> •
    <a href="https://matmax.world" target="_blank">Website</a>
  </p>
  <p>© 2025 MATMAX WORLDWIDE. Made with ❤️ for humanity.</p>
</div>