# 🚀 Payload CMS MCP Server

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
  
  <h3>A validation and query service for Payload CMS code</h3>
  <p>Designed to be used with Cursor IDE and Claude for AI-assisted development</p>
</div>

<hr>

## 📋 Overview

The Payload CMS MCP Server provides a powerful interface for validating Payload CMS code, querying validation rules, and executing MCP queries. It helps developers build better Payload CMS applications by providing real-time validation and suggestions through natural language commands.

### 🌐 Production URLs

The MCP server is deployed at:

* Primary URL: [https://www.payloadcmsmcp.info](https://www.payloadcmsmcp.info)

<hr>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>✅</h3>
        <b>Code Validation</b>
        <p>Validates Payload CMS collections, fields, globals, and other components</p>
      </td>
      <td align="center">
        <h3>📝</h3>
        <b>Detailed Feedback</b>
        <p>Provides comprehensive feedback on validation issues</p>
      </td>
      <td align="center">
        <h3>💡</h3>
        <b>Smart Suggestions</b>
        <p>Offers intelligent suggestions for improving code quality and security</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <h3>🔍</h3>
        <b>SQL-like Queries</b>
        <p>Supports SQL-like queries for validation rules</p>
      </td>
      <td align="center">
        <h3>🤖</h3>
        <b>AI Integration</b>
        <p>Seamlessly integrates with Cursor IDE for AI-assisted development</p>
      </td>
      <td align="center">
        <h3>🔄</h3>
        <b>Content Modeling</b>
        <p>Define collections, fields, and relationships through conversation</p>
      </td>
    </tr>
  </table>
</div>

<hr>

## 🔌 API Endpoints

### Validation Endpoint

```http
POST /api/validate
```

Request body:
```json
{
  "code": "const Posts = { slug: 'posts', fields: [...] }",
  "fileType": "collection"
}
```

Response:
```json
{
  "isValid": true|false,
  "messages": ["..."],
  "suggestions": [
    {
      "message": "...",
      "code": "..."
    }
  ],
  "references": [
    {
      "title": "...",
      "url": "..."
    }
  ]
}
```

### Query Endpoint

```http
POST /api/query
```

Request body:
```json
{
  "query": "security",
  "fileType": "collection"
}
```

Response:
```json
{
  "rules": [
    {
      "id": "...",
      "description": "...",
      "type": "collection|field|global"
    }
  ]
}
```

### MCP Query Endpoint

```http
POST /api/mcp_query
```

Request body:
```json
{
  "query": "SELECT * FROM validation_rules WHERE type = 'collection'"
}
```

Response:
```json
{
  "results": [...]
}
```

<hr>

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Matmax-Worldwide/payloadcmsmcp.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the server at `http://localhost:3000`

5. Open `local-landing.html` in your browser

<hr>

## 💻 Client Code

The `client` directory contains:

1. `mcp-client.js` - A JavaScript client for Node.js applications
2. `index.html` - An HTML page for web application demonstration
3. `index-local.html` - A local version of the client that works with the local server

<hr>

## 🔗 Integration with Cursor IDE

This MCP server is designed to be used with Cursor IDE for AI-assisted development of Payload CMS applications. The AI model can use the validation and query endpoints to provide real-time feedback and suggestions.

You can use the production endpoints:

* Validation endpoint: `https://www.payloadcmsmcp.info/api/validate`
* Query endpoint: `https://www.payloadcmsmcp.info/api/query`
* MCP Query endpoint: `https://www.payloadcmsmcp.info/api/mcp_query`

Or the local endpoints:

* Validation endpoint: `http://localhost:3000/api/validate`
* Query endpoint: `http://localhost:3000/api/query`
* MCP Query endpoint: `http://localhost:3000/api/mcp_query`

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

Visit [matmax.world](https://matmax.world) to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation.

<div align="center">
  <p>
    <a href="https://github.com/Matmax-Worldwide" target="_blank">GitHub</a> •
    <a href="https://www.linkedin.com/company/the-wellness-brand" target="_blank">LinkedIn</a> •
    <a href="https://matmax.world" target="_blank">Website</a>
  </p>
  <p>© 2025 MATMAX WORLDWIDE. Made with ❤️ for humanity.</p>
</div>