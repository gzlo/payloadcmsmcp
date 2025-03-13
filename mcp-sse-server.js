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
      name: "mcp__query",
      description: "Run a read-only SQL query",
      parameters: {
        type: "object",
        properties: {
          sql: {
            type: "string"
          }
        }
      }
    },
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
 * Sends an SSE event with proper formatting
 * @param {http.ServerResponse} res - The response object
 * @param {string} event - The event name
 * @param {object} data - The event data
 */
function sendEvent(res, event, data) {
  // Ensure proper formatting with newlines
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  // Flush the data immediately
  if (typeof res.flush === 'function') {
    res.flush();
  }
}

/**
 * Serves the homepage HTML
 * @param {http.ServerResponse} res - The response object
 */
function serveHomepage(res) {
  // Get the server URL (use environment variable or default to localhost)
  const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
  const productionUrl = 'https://www.payloadcmsmcp.info';
  
  // Use the production URL if available, otherwise use the server URL
  const displayUrl = process.env.NODE_ENV === 'production' ? productionUrl : serverUrl;
  
  // Modern HTML for the homepage
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Payload CMS MCP Server - Server-Sent Events (SSE) and API endpoints for the Payload CMS Model Control Primitive (MCP)">
  <title>Payload CMS MCP Server</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Color Palette */
      --primary: #3b82f6;
      --primary-dark: #2563eb;
      --primary-light: #60a5fa;
      --secondary: #10b981;
      --secondary-dark: #059669;
      --accent: #8b5cf6;
      --dark: #1e293b;
      --dark-light: #334155;
      --light: #f8fafc;
      --light-dark: #e2e8f0;
      --gray: #64748b;
      --gray-light: #94a3b8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      
      /* Typography */
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      
      /* Spacing */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-12: 3rem;
      --space-16: 4rem;
      
      /* Borders */
      --radius-sm: 0.25rem;
      --radius: 0.5rem;
      --radius-md: 0.75rem;
      --radius-lg: 1rem;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      
      /* Transitions */
      --transition: all 0.2s ease;
      --transition-slow: all 0.3s ease;
    }
    
    /* Reset & Base Styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: var(--font-sans);
      line-height: 1.6;
      color: var(--dark);
      background: linear-gradient(135deg, #f6f8fc 0%, #e2e8f0 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    a {
      color: var(--primary);
      text-decoration: none;
      transition: var(--transition);
    }
    
    a:hover {
      color: var(--primary-dark);
    }
    
    /* Layout */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-4);
    }
    
    .page-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
      padding: var(--space-8) 0;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: var(--space-12) 0;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CiAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICA8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIC8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+Cjwvc3ZnPg==');
      opacity: 0.3;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }
    
    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--space-4);
      background: linear-gradient(90deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .subtitle {
      font-size: 1.25rem;
      font-weight: 300;
      max-width: 600px;
      margin: 0 auto var(--space-6);
      opacity: 0.9;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: var(--space-2) var(--space-4);
      font-size: 0.9rem;
      margin-bottom: var(--space-4);
    }
    
    .status-badge::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--success);
      margin-right: var(--space-2);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }
    
    /* Cards */
    .card {
      background-color: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: var(--space-6);
      margin-bottom: var(--space-6);
      transition: var(--transition-slow);
      border: 1px solid var(--light-dark);
      overflow: hidden;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--light-dark);
    }
    
    .card-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-light);
      color: white;
      border-radius: var(--radius);
      margin-right: var(--space-4);
      font-size: 1.25rem;
    }
    
    .status-card {
      background: linear-gradient(135deg, var(--light) 0%, #f1f5f9 100%);
      border-left: 4px solid var(--primary);
    }
    
    .status-item {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--light-dark);
    }
    
    .status-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .status-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--success);
      color: white;
      border-radius: 50%;
      margin-right: var(--space-4);
      font-size: 0.75rem;
    }
    
    .status-content {
      flex: 1;
    }
    
    .status-content h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-1);
      color: var(--dark);
    }
    
    .status-content p {
      font-size: 0.9rem;
      color: var(--gray);
      margin: 0;
    }
    
    /* Endpoint Cards */
    .endpoints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .endpoint-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-top: 4px solid var(--primary);
    }
    
    .endpoint-card h3 {
      color: var(--primary-dark);
      font-size: 1.25rem;
      margin-bottom: var(--space-2);
    }
    
    .endpoint-card p {
      color: var(--gray);
      margin-bottom: var(--space-4);
      flex: 1;
    }
    
    /* Code Blocks */
    pre {
      background-color: var(--dark);
      color: white;
      padding: var(--space-4);
      border-radius: var(--radius);
      overflow-x: auto;
      margin: var(--space-4) 0;
      position: relative;
    }
    
    pre::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }
    
    code {
      font-family: var(--font-mono);
      font-size: 0.9rem;
    }
    
    .inline-code {
      background-color: var(--light-dark);
      color: var(--primary-dark);
      padding: 0.1em 0.4em;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.9em;
    }
    
    /* Sections */
    .section {
      margin-bottom: var(--space-12);
    }
    
    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: var(--space-6);
      color: var(--dark);
      position: relative;
      padding-bottom: var(--space-2);
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      border-radius: var(--radius);
    }
    
    /* Integration Section */
    .integration-section {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: var(--radius);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      border: 1px solid #bae6fd;
    }
    
    /* CLI Section */
    .cli-section {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: var(--radius);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      border: 1px solid var(--light-dark);
    }
    
    .cli-command {
      margin-bottom: var(--space-6);
    }
    
    .cli-command:last-child {
      margin-bottom: 0;
    }
    
    .cli-command p {
      margin-bottom: var(--space-2);
      font-weight: 500;
    }
    
    /* Footer */
    .footer {
      background-color: var(--dark);
      color: white;
      padding: var(--space-12) 0 var(--space-6);
      margin-top: var(--space-12);
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }
    
    .footer-section h3 {
      font-size: 1.25rem;
      margin-bottom: var(--space-4);
      color: white;
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: var(--space-2);
    }
    
    .footer-links a {
      color: var(--gray-light);
      transition: var(--transition);
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    .matmax-section {
      margin-top: var(--space-8);
      padding-top: var(--space-8);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }
    
    .matmax-section p {
      color: var(--gray-light);
      max-width: 800px;
      margin: 0 auto var(--space-4);
      font-size: 0.9rem;
    }
    
    .matmax-logo {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: var(--space-4);
      color: white;
    }
    
    .copyright {
      text-align: center;
      padding-top: var(--space-6);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--gray-light);
      font-size: 0.9rem;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .logo {
        font-size: 2rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
      
      .endpoints-grid {
        grid-template-columns: 1fr;
      }
      
      .header {
        padding: var(--space-8) 0;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="status-badge">Server Online</div>
          <h1 class="logo">Payload CMS MCP Server</h1>
          <p class="subtitle">Server-Sent Events (SSE) and API endpoints for the Payload CMS Model Control Primitive (MCP)</p>
        </div>
      </div>
    </header>
    
    <main>
      <div class="container">
        <section class="section">
          <div class="card status-card">
            <div class="card-header">
              <div class="card-icon" style="background-color: var(--success);">
                ✓
              </div>
              <h2>Server Status</h2>
            </div>
            
            <div class="status-item">
              <div class="status-icon">✓</div>
              <div class="status-content">
                <h3>Server</h3>
                <p>Running at <span class="inline-code">${displayUrl}</span></p>
              </div>
            </div>
            
            <div class="status-item">
              <div class="status-icon">✓</div>
              <div class="status-content">
                <h3>SSE Endpoints</h3>
                <p>Active at <span class="inline-code">${displayUrl}/sse</span></p>
                <p>Active at <span class="inline-code">${displayUrl}/api/sse</span></p>
              </div>
            </div>
            
            <div class="status-item">
              <div class="status-icon">✓</div>
              <div class="status-content">
                <h3>API Status</h3>
                <p>All endpoints operational</p>
              </div>
            </div>
          </div>
        </section>
        
        <section class="section">
          <h2 class="section-title">Available Endpoints</h2>
          
          <div class="endpoints-grid">
            <div class="card endpoint-card">
              <div class="card-header">
                <div class="card-icon">
                  ⟳
                </div>
                <h3>/sse</h3>
              </div>
              <p>Server-Sent Events endpoint for real-time communication with Cursor IDE.</p>
              <pre><code>const eventSource = new EventSource('${displayUrl}/sse');</code></pre>
            </div>
            
            <div class="card endpoint-card">
              <div class="card-header">
                <div class="card-icon" style="background-color: var(--secondary);">
                  ✓
                </div>
                <h3>/api/validate</h3>
              </div>
              <p>Validates Payload CMS code against best practices and patterns.</p>
              <pre><code>fetch('${displayUrl}/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: "module.exports = { slug: 'posts', fields: [] }",
    fileType: "collection"
  })
});</code></pre>
            </div>
            
            <div class="card endpoint-card">
              <div class="card-header">
                <div class="card-icon" style="background-color: var(--accent);">
                  ?
                </div>
                <h3>/api/query</h3>
              </div>
              <p>Queries validation rules for Payload CMS components.</p>
              <pre><code>fetch('${displayUrl}/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "list rules",
    fileType: "collection"
  })
});</code></pre>
            </div>
            
            <div class="card endpoint-card">
              <div class="card-header">
                <div class="card-icon" style="background-color: var(--primary-dark);">
                  ⚙
                </div>
                <h3>/api/mcp_query</h3>
              </div>
              <p>Executes SQL-like MCP queries to retrieve specific information.</p>
              <pre><code>fetch('${displayUrl}/api/mcp_query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sql: "LIST RULES FOR \\"collection\\""
  })
});</code></pre>
            </div>
          </div>
        </section>
        
        <section class="section">
          <div class="integration-section">
            <h2 class="section-title">Cursor IDE Integration</h2>
            <p>To integrate with Cursor IDE, configure the IDE to use the following URL for the SSE transport:</p>
            <pre><code>${displayUrl}/sse</code></pre>
            <p>This will enable real-time communication between Cursor IDE and the MCP server, allowing for code validation and intelligent suggestions.</p>
          </div>
        </section>
        
        <section class="section">
          <div class="cli-section">
            <h2 class="section-title">CLI Commands</h2>
            <p>You can also use the Payload CMS MCP CLI to interact with this server:</p>
            
            <div class="cli-command">
              <p>Validate a Payload CMS file:</p>
              <pre><code>npx @payloadcmsmcp.info validate ./collections/Posts.js</code></pre>
            </div>
            
            <div class="cli-command">
              <p>Query validation rules:</p>
              <pre><code>npx @payloadcmsmcp.info query "list rules" collection</code></pre>
            </div>
            
            <div class="cli-command">
              <p>Execute an MCP query:</p>
              <pre><code>npx @payloadcmsmcp.info mcp "LIST RULES FOR \\"collection\\""</code></pre>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Payload CMS MCP Server</h3>
            <p>A validation and query service for Payload CMS code, designed to be used with Cursor IDE for AI-assisted development.</p>
          </div>
          
          <div class="footer-section">
            <h3>Resources</h3>
            <ul class="footer-links">
              <li><a href="https://github.com/Matmax-Worldwide/payloadcmsmcp">GitHub Repository</a></li>
              <li><a href="https://payloadcms.com">Payload CMS</a></li>
              <li><a href="https://cursor.sh">Cursor IDE</a></li>
              <li><a href="https://modelcontextprotocol.ai">Model Context Protocol</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>API Endpoints</h3>
            <ul class="footer-links">
              <li><a href="/sse">/sse</a></li>
              <li><a href="/api/sse">/api/sse</a></li>
              <li><a href="#api-validate">/api/validate</a></li>
              <li><a href="#api-query">/api/query</a></li>
            </ul>
          </div>
        </div>
        
        <div class="matmax-section">
          <div class="matmax-logo">MATMAX WORLDWIDE</div>
          <p>Creating technology that helps humans be more human. We believe in tech for good—tools that enhance our lives while respecting our humanity.</p>
          <p>Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.</p>
          <p>Visit <a href="https://matmax.world">matmax.world</a> to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation.</p>
        </div>
        
        <div class="copyright">
          <p>© 2025 MATMAX WORLDWIDE. Made with ❤️ for humanity.</p>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>
  `;
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
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
    
    // Generate client ID
    const clientId = Date.now().toString();
    
    // Send connected event first with proper format
    sendEvent(res, 'connected', { clientId });
    
    // Send MCP tools definition immediately after - this is critical for Cursor MCP
    sendEvent(res, 'tools', mcpTools);
    
    // Keep connection alive with periodic pings
    const pingInterval = setInterval(() => {
      res.write(': ping\n\n');
      // Flush the data immediately
      if (typeof res.flush === 'function') {
        res.flush();
      }
    }, 30000);
    
    // Handle client disconnect
    req.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      clearInterval(pingInterval);
    });
    
    // Handle errors
    req.on('error', (err) => {
      console.error(`Error with client ${clientId}: ${err.message}`);
      clearInterval(pingInterval);
    });
    
    // Log connection
    console.log(`Client connected: ${clientId}`);
    
    // Handle connection timeout
    req.setTimeout(0); // Disable timeout
  } 
  // Handle MCP API endpoints
  else if (parsedUrl.pathname === '/api/validate' || parsedUrl.pathname === '/api/query' || parsedUrl.pathname === '/api/mcp_query') {
    // Only accept POST requests for API endpoints
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    
    // Read request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        let result = { success: true, message: 'Operation completed successfully' };
        
        // Process based on endpoint
        if (parsedUrl.pathname === '/api/validate') {
          console.log(`Validating code: ${data.code && data.code.substring(0, 50)}...`);
          result = {
            valid: true,
            issues: [],
            suggestions: [
              {
                type: 'info',
                message: 'This is a placeholder validation response. Implement actual validation logic here.'
              }
            ]
          };
        } else if (parsedUrl.pathname === '/api/query') {
          console.log(`Processing query: ${data.query}`);
          result = {
            results: [
              {
                rule: 'collection-fields-required',
                description: 'Collections should have at least one field defined'
              },
              {
                rule: 'slug-required',
                description: 'Collections must have a slug property'
              }
            ]
          };
        } else if (parsedUrl.pathname === '/api/mcp_query') {
          console.log(`Processing MCP query: ${data.sql}`);
          
          // Handle MCP SQL queries
          if (data.sql) {
            // Parse the SQL query
            const sqlQuery = data.sql.trim().toUpperCase();
            
            // Example implementation - replace with actual logic
            if (sqlQuery.startsWith('LIST RULES')) {
              result = {
                columns: ["rule", "description"],
                rows: [
                  ["collection-fields-required", "Collections should have at least one field defined"],
                  ["slug-required", "Collections must have a slug property"],
                  ["access-control", "Consider adding access control to collections"],
                  ["hooks-naming", "Use consistent naming for hooks"]
                ]
              };
            } else if (sqlQuery.startsWith('DESCRIBE')) {
              result = {
                columns: ["property", "type", "required", "description"],
                rows: [
                  ["slug", "string", "yes", "Unique identifier for the collection"],
                  ["fields", "array", "yes", "Array of field definitions"],
                  ["access", "object", "no", "Access control configuration"],
                  ["hooks", "object", "no", "Lifecycle hooks for the collection"]
                ]
              };
            } else {
              result = {
                columns: ["message"],
                rows: [["Query not recognized. Try 'LIST RULES' or 'DESCRIBE [entity]'"]]
              };
            }
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "SQL query is required" }));
            return;
          }
        }
        
        // Send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error(`Error processing request: ${error.message}`);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Invalid request: ${error.message}` }));
      }
    });
  }
  else if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
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