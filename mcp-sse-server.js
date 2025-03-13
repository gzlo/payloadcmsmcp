#!/usr/bin/env node

/**
 * Simple MCP-compatible SSE server for testing with Cursor
 */

const http = require('http');
const url = require('url');

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