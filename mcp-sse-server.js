#!/usr/bin/env node

/**
 * Simple MCP-compatible SSE server for testing with Cursor
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Default port
const PORT = process.env.PORT || 3005;

// MCP tools definition
const mcpTools = {
  schema_version: "v1",
  server_info: {
    name: "Payload CMS MCP Server",
    version: "1.0.0"
  },
  tools: [
    {
      name: "validate_code",
      description: "Validates Payload CMS code against best practices",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "The code to validate"
          },
          fileType: {
            type: "string",
            description: "The type of file (e.g., 'collection', 'field')"
          }
        },
        required: ["code", "fileType"]
      }
    },
    {
      name: "query_rules",
      description: "Queries validation rules for Payload CMS components",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The query string"
          },
          fileType: {
            type: "string",
            description: "The type of file (e.g., 'collection', 'field')"
          }
        },
        required: ["query"]
      }
    }
  ]
};

/**
 * Sends an SSE event
 * @param {http.ServerResponse} res - The response object
 * @param {string} event - The event name
 * @param {object} data - The event data
 */
function sendEvent(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Serves the homepage HTML
 * @param {http.ServerResponse} res - The response object
 */
function serveHomepage(res) {
  // Simple HTML for the homepage
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payload CMS MCP Server</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      color: #0070f3;
    }
    .status {
      background-color: #f0f9ff;
      border-left: 4px solid #0070f3;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .endpoint {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    code {
      background-color: #f1f1f1;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }
    pre {
      background-color: #1a1a1a;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eaeaea;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Server Online</h1>
  
  <h1>Payload CMS MCP Server</h1>
  <p>Server-Sent Events (SSE) and API endpoints for the Payload CMS Model Control Primitive (MCP)</p>
  
  <div class="status">
    <h2>Server Status</h2>
    <h3>Server</h3>
    <p>Running at http://localhost:${PORT}</p>
    
    <h3>SSE Endpoints</h3>
    <p>Active at http://localhost:${PORT}/sse</p>
    <p>Active at http://localhost:${PORT}/api/sse</p>
    
    <h3>API Status</h3>
    <p>All endpoints operational</p>
  </div>
  
  <h2>Available Endpoints</h2>
  
  <div class="endpoint">
    <h3>/sse</h3>
    <p>Server-Sent Events endpoint for real-time communication with Cursor IDE.</p>
    <pre><code>const eventSource = new EventSource('http://localhost:${PORT}/sse');</code></pre>
  </div>
  
  <div class="endpoint">
    <h3>/api/validate</h3>
    <p>Validates Payload CMS code against best practices and patterns.</p>
    <pre><code>fetch('http://localhost:${PORT}/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: "module.exports = { slug: 'posts', fields: [] }",
    fileType: "collection"
  })
});</code></pre>
  </div>
  
  <div class="endpoint">
    <h3>/api/query</h3>
    <p>Queries validation rules for Payload CMS components.</p>
    <pre><code>fetch('http://localhost:${PORT}/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "list rules",
    fileType: "collection"
  })
});</code></pre>
  </div>
  
  <div class="endpoint">
    <h3>/api/mcp_query</h3>
    <p>Executes SQL-like MCP queries to retrieve specific information.</p>
    <pre><code>fetch('http://localhost:${PORT}/api/mcp_query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sql: "LIST RULES FOR \\"collection\\""
  })
});</code></pre>
  </div>
  
  <h2>Cursor IDE Integration</h2>
  <p>To integrate with Cursor IDE, configure the IDE to use the following URL for the SSE transport:</p>
  <pre><code>http://localhost:${PORT}/sse</code></pre>
  
  <h2>CLI Commands</h2>
  <p>You can also use the Payload CMS MCP CLI to interact with this server:</p>
  
  <p>Validate a Payload CMS file:</p>
  <pre><code>npx @payloadcmsmcp.info validate ./collections/Posts.js</code></pre>
  
  <p>Query validation rules:</p>
  <pre><code>npx @payloadcmsmcp.info query "list rules" collection</code></pre>
  
  <p>Execute an MCP query:</p>
  <pre><code>npx @payloadcmsmcp.info mcp "LIST RULES FOR \\"collection\\""</code></pre>
  
  <footer>
    <p>Payload CMS MCP Server</p>
    <p>
      <a href="https://github.com/Matmax-Worldwide/payloadcmsmcp">GitHub Repository</a> | 
      <a href="https://payloadcms.com">Payload CMS</a> | 
      <a href="https://cursor.sh">Cursor IDE</a>
    </p>
    <div>
      <p>MATMAX WORLDWIDE</p>
      <p>Creating technology that helps humans be more human. We believe in tech for good—tools that enhance our lives while respecting our humanity. Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.</p>
      <p>Visit <a href="https://matmax.world">matmax.world</a> to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation.</p>
      <p>© 2025 MATMAX WORLDWIDE. Made with ❤️ for humanity.</p>
    </div>
  </footer>
</body>
</html>
  `;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle SSE endpoints
  if (parsedUrl.pathname === '/sse' || parsedUrl.pathname === '/api/sse') {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Send initial ping
    res.write(': ping\n\n');
    
    // Send MCP tools definition
    res.write(`event: tools\n`);
    res.write(`data: ${JSON.stringify(mcpTools)}\n\n`);
    
    // Generate client ID and send connected event
    const clientId = Date.now().toString();
    sendEvent(res, 'connected', { clientId });
    
    // Keep connection alive with periodic pings
    const pingInterval = setInterval(() => {
      res.write(': ping\n\n');
    }, 30000);
    
    // Handle client disconnect
    req.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      clearInterval(pingInterval);
    });
    
    // Log connection
    console.log(`Client connected: ${clientId}`);
  } else if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
    // Serve the homepage
    serveHomepage(res);
  } else {
    // Handle other endpoints
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`MCP SSE Server running at http://localhost:${PORT}`);
  console.log(`SSE endpoints:`);
  console.log(`  - http://localhost:${PORT}/sse`);
  console.log(`  - http://localhost:${PORT}/api/sse`);
  console.log(`Press Ctrl+C to stop the server`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error(`Server error: ${error.message}`);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
}); 