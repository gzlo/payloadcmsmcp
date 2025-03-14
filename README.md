# 🚀 Payload CMS 3.0 MCP Server

<div align="center">
  <p align="center">
    <img src="https://www.payloadcmsmcp.info/logopayload.png" alt="Payload CMS Logo" width="120" height="120" style="border-radius: 10px; padding: 5px; background-color: white; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);" />
  </p>
<p align="center">
    <img src="https://img.shields.io/badge/Model%20Context%20Protocol-Enabled-6366F1?style=for-the-badge" alt="MCP Enabled" />
    <img src="https://img.shields.io/badge/Payload%20CMS%203.0-Integration-3B82F6?style=for-the-badge" alt="Payload CMS" />
    <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Railway-Deployment-0B0D0E?style=for-the-badge" alt="Railway Deployment" />
  </p>
  
  <h3>A specialized MCP server for Payload CMS 3.0</h3>
  <p>Validate code, generate templates, and scaffold projects following best practices</p>
</div>

<hr>

## 📋 Overview

The Payload CMS 3.0 MCP Server is a specialized Model Context Protocol server designed to enhance your Payload CMS development experience. It helps developers build better Payload CMS applications by providing code validation, template generation, and project scaffolding capabilities that follow best practices.

<hr>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>📚</h3>
        <b>Code Validation</b>
        <p>Validate Payload CMS code for collections, fields, globals, and config files with detailed feedback on syntax errors and best practices.</p>
      </td>
      <td align="center">
        <h3>🔍</h3>
        <b>Code Generation</b>
        <p>Generate code templates for collections, fields, globals, access control, hooks, endpoints, plugins, blocks, and migrations.</p>
      </td>
      <td align="center">
        <h3>🚀</h3>
        <b>Project Scaffolding</b>
        <p>Scaffold entire Payload CMS projects with validated options for consistency and adherence to best practices.</p>
      </td>
    </tr>
  </table>
</div>

<hr>

## 🔧 Payload CMS 3.0 Capabilities

### Validation Tools

* `validate` - Validate code for collections, fields, globals, and config
* `query` - Query validation rules and best practices
* `mcp_query` - Execute SQL-like queries for Payload CMS structures

### Code Generation

* `generate_template` - Generate code templates for various components
* `generate_collection` - Create complete collection definitions
* `generate_field` - Generate field definitions with proper typing

### Project Setup

* `scaffold_project` - Create entire Payload CMS project structures
* `validate_scaffold_options` - Ensure scaffold options follow best practices

### Technical Implementation

* `Express.js` - For HTTP request handling
* `TypeScript` - For type safety and better developer experience
* `Zod` - For schema validation
* `Redis` - For caching and state management

<hr>

## 🚀 Getting Started

### 1. Prerequisites

Before you begin, make sure you have:

* Node.js 18+ (required for Payload CMS 3.0)
* An active Railway account
* A Railway API token (create one at [railway.app/account/tokens](https://railway.app/account/tokens))
* Basic familiarity with Payload CMS 3.0 concepts

### 2. Configure Cursor

To use with Cursor IDE:

1. Open Cursor Settings
2. Go to MCP Servers section
3. Add a new MCP server
4. Name it "Payload CMS 3.0 MCP"
5. Set Transport Type to "Command"
6. Set Command to: `railway run --service=YOUR_SERVICE_ID`
7. Save the configuration

### 3. Using the MCP Server

Once configured, you can use these tools in your AI prompts:

* **Code Validation:** "Validate this Payload CMS collection code"
* **Template Generation:** "Generate a template for a media collection"
* **Query Rules:** "Query validation rules for access control"
* **SQL-like Queries:** "Execute a query to find field types for collections"

### 4. Example Workflow

A typical workflow with the Payload CMS MCP Server:

1. Generate a collection template with specific fields
2. Validate the generated code for best practices
3. Query for specific validation rules to improve the code
4. Generate additional components like hooks or endpoints
5. Scaffold a complete project structure when ready

<hr>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<hr>

## 🌍 About MATMAX WORLDWIDE

<div align="center">
  <h3>MATMAX WORLDWIDE</h3>
  <p>Creating technology that helps humans be more human.</p>
</div>

We believe in tech for good—tools that enhance our lives while respecting our humanity.

Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.

Visit [matmax.world](https://matmax.world) to learn more about our vision for human-centered technology.