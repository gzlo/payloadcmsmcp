# 🚀 Payload CMS MCP Server

<div align="center">
  <img src="public/favicon.svg" alt="Payload CMS MCP Server Logo" width="120" height="120">
  <h3>A validation and query service for Payload CMS code</h3>
  <p>Designed to be used with Cursor IDE for AI-assisted development</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Payload CMS](https://img.shields.io/badge/Payload%20CMS-3.0-brightgreen)](https://payloadcms.com)
  [![Model Context Protocol](https://img.shields.io/badge/MCP-Enabled-5046e5)](https://modelcontextprotocol.ai)
</div>

## 📋 Overview

The Payload CMS MCP Server provides endpoints for validating Payload CMS code, querying validation rules, and executing MCP queries. It helps developers build better Payload CMS applications by providing real-time validation and suggestions.

### 🌐 Production URL

The MCP server is deployed at: [https://www.payloadcmsmcp.info](https://www.payloadcmsmcp.info)

## ✨ Features

- **Code Validation** - Validates Payload CMS collections, fields, globals, and other components
- **Detailed Feedback** - Provides comprehensive feedback on validation issues
- **Smart Suggestions** - Offers intelligent suggestions for improving code quality and security
- **SQL-like Queries** - Supports SQL-like queries for validation rules
- **AI Integration** - Seamlessly integrates with Cursor IDE for AI-assisted development

## 🔌 API Endpoints

### Validation Endpoint

```
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

```
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

```
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

6. For detailed instructions, see the [Local Usage Guide](LOCAL_USAGE.md)

## 💻 Client Code

The `client` directory contains:

1. `mcp-client.js` - A JavaScript client for Node.js applications
2. `index.html` - An HTML page for web application demonstration
3. `index-local.html` - A local version of the client that works with the local server

## 🔗 Integration with Cursor IDE

This MCP server is designed to be used with [Cursor IDE](https://cursor.sh) for AI-assisted development of Payload CMS applications. The AI model can use the validation and query endpoints to provide real-time feedback and suggestions.

You can use either the production endpoints:

- Validation endpoint: `https://www.payloadcmsmcp.info/api/validate`
- Query endpoint: `https://www.payloadcmsmcp.info/api/query`
- MCP Query endpoint: `https://www.payloadcmsmcp.info/api/mcp_query`

Or the local endpoints:

- Validation endpoint: `http://localhost:3000/api/validate`
- Query endpoint: `http://localhost:3000/api/query`
- MCP Query endpoint: `http://localhost:3000/api/mcp_query`

## 📚 Documentation

For more detailed documentation, please refer to:

- [Local Usage Guide](LOCAL_USAGE.md)
- [API Documentation](SUMMARY.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 About MATMAX WORLDWIDE

This MCP server is a contribution to the Payload CMS community by MATMAX WORLDWIDE. We create technology that helps humans be more human. We believe in tech for good—tools that enhance our lives while respecting our humanity.

Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.

Visit [matmax.world](https://matmax.world) to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation. Connect with us on [LinkedIn](https://www.linkedin.com/company/the-wellness-brand) to stay updated on our latest initiatives.

---

<div align="center">
  <p>© 2025 MATMAX WORLDWIDE. Made with ❤️ for humanity.</p>
  <div style="margin-top: 10px;">
    <a href="https://github.com/Matmax-Worldwide" target="_blank" style="margin: 0 10px;">GitHub</a> •
    <a href="https://instagram.com/matmaxyoga" target="_blank" style="margin: 0 10px;">Instagram</a> •
    <a href="https://www.linkedin.com/company/the-wellness-brand" target="_blank" style="margin: 0 10px;">LinkedIn</a>
  </div>
</div>
