# Payload CMS MCP CLI & Server

A command-line interface and SSE server for interacting with the Payload CMS Model Control Primitive (MCP).

## Features

- **Validate Payload CMS Code**: Check your collections, fields, and other Payload CMS configurations for best practices and potential issues.
- **Query Validation Rules**: Discover and explore the validation rules available for different types of Payload CMS components.
- **Execute MCP Queries**: Run SQL-like queries against the MCP server to retrieve specific information.
- **SSE Server**: Run a local Server-Sent Events (SSE) server for integration with Cursor IDE.

## Installation

### Global Installation

```bash
npm install -g @payloadcmsmcp.info
```

### Using with npx

```bash
npx @payloadcmsmcp.info <command> [options]
```

## Usage

### CLI Commands

#### Validate a Payload CMS File

```bash
payloadcmsmcp validate ./collections/Posts.js
# or
npx @payloadcmsmcp.info validate ./collections/Posts.js
```

#### Query Validation Rules

```bash
payloadcmsmcp query "list rules" collection
# or
npx @payloadcmsmcp.info query "list rules" collection
```

#### Execute an MCP Query

```bash
payloadcmsmcp mcp "LIST RULES FOR \"collection\""
# or
npx @payloadcmsmcp.info mcp "LIST RULES FOR \"collection\""
```

#### Start the SSE Server

```bash
payloadcmsmcp server [port]
# or
npx @payloadcmsmcp.info server [port]
```

The default port is 3002. You can specify a different port as an argument.

### SSE Server

The SSE server provides the following endpoints:

- `/sse` - SSE endpoint for Cursor IDE
- `/api/validate` - Validate Payload CMS code
- `/api/query` - Query validation rules
- `/api/mcp_query` - Execute MCP queries

#### Configuring Cursor IDE

To use the SSE server with Cursor IDE, configure the IDE to use one of the following URLs for the SSE transport:

```
http://localhost:3002/sse  # Local SSE server
```

Or use our hosted SSE server:

```
https://www.payloadcmsmcp.info/api/sse
```

## Development

### Prerequisites

- Node.js 14 or higher
- npm 6 or higher

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Matmax-Worldwide/payloadcmsmcp.git
   cd payloadcmsmcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a symlink for local development:
   ```bash
   npm link
   ```

### Running Locally

```bash
node cli.js <command> [options]
```

## Deployment

### Vercel Deployment

This project can be deployed to Vercel:

1. Fork the repository on GitHub
2. Connect your Vercel account to your GitHub account
3. Import the repository in Vercel
4. Deploy

## License

MIT

## Author

MATMAX WORLDWIDE 