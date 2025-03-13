#!/usr/bin/env node

/**
 * Payload CMS MCP SSE Server
 * 
 * A Server-Sent Events (SSE) server for the Payload CMS MCP
 * that can be used with Cursor IDE.
 */

const http = require('http');
const fetch = require('node-fetch');
const url = require('url');

// Default port for the SSE server
const PORT = process.env.PORT || 3002;

// MCP Server URL
const MCP_SERVER_URL = 'https://www.payloadcmsmcp.info';
const SSE_SERVER_URL = 'https://www.payloadcmsmcp.info';

/**
 * Handles SSE connections
 * @param {http.IncomingMessage} req - The request object
 * @param {http.ServerResponse} res - The response object
 */
async function handleSSE(req, res) {
  const parsedUrl = url.parse(req.url, true);
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send a comment to keep the connection alive
  res.write(': ping\n\n');
  
  // Handle different endpoints
  if (parsedUrl.pathname === '/sse') {
    // Initial connection
    const clientId = Date.now().toString();
    console.log(`Client connected: ${clientId}`);
    
    // Send client ID
    sendEvent(res, 'connected', { clientId });
    
    // Keep the connection alive with periodic pings
    const pingInterval = setInterval(() => {
      res.write(': ping\n\n');
    }, 30000);
    
    // Clean up on close
    req.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      clearInterval(pingInterval);
    });
  } else {
    // Unknown endpoint
    sendEvent(res, 'error', { message: 'Unknown endpoint' });
    res.end();
  }
}

/**
 * Handles API requests
 * @param {http.IncomingMessage} req - The request object
 * @param {http.ServerResponse} res - The response object
 */
async function handleAPI(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const endpoint = parsedUrl.pathname.replace('/api/', '');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  try {
    // Read request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // Forward request to MCP server
        const response = await fetch(`${MCP_SERVER_URL}/api/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        // Send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error(`Error processing request: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Failed to process request: ${error.message}` }));
      }
    });
  } catch (error) {
    console.error(`Error handling API request: ${error.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Server error: ${error.message}` }));
  }
}

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
 * Creates and starts the server
 */
function startServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/sse') {
      handleSSE(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/')) {
      handleAPI(req, res);
    } else {
      // Serve a simple HTML page for the root
      if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payload CMS MCP Server</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              :root {
                --primary: #3b82f6;
                --primary-dark: #2563eb;
                --secondary: #10b981;
                --dark: #1e293b;
                --light: #f8fafc;
                --gray: #64748b;
                --gray-light: #e2e8f0;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --radius: 8px;
                --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                background-color: var(--light);
                color: var(--dark);
                line-height: 1.6;
                padding: 0;
                margin: 0;
              }
              
              .container {
                max-width: 1100px;
                margin: 0 auto;
                padding: 0 20px;
              }
              
              header {
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                color: white;
                padding: 60px 0 80px;
                position: relative;
                overflow: hidden;
              }
              
              header::before {
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
              }
              
              h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 16px;
              }
              
              .subtitle {
                font-size: 1.2rem;
                font-weight: 300;
                max-width: 600px;
                margin-bottom: 24px;
              }
              
              .status-badge {
                display: inline-flex;
                align-items: center;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                padding: 8px 16px;
                font-size: 0.9rem;
                margin-bottom: 16px;
              }
              
              .status-badge::before {
                content: '';
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--success);
                margin-right: 8px;
              }
              
              main {
                margin-top: -40px;
                padding-bottom: 60px;
              }
              
              .card {
                background-color: white;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                margin-bottom: 24px;
                overflow: hidden;
              }
              
              .card-header {
                padding: 20px 24px;
                border-bottom: 1px solid var(--gray-light);
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              
              .card-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--dark);
                margin: 0;
              }
              
              .card-body {
                padding: 24px;
              }
              
              .status-card {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
              }
              
              .status-item {
                flex: 1;
                min-width: 200px;
                background-color: var(--light);
                border-radius: var(--radius);
                padding: 16px;
              }
              
              .status-item h3 {
                font-size: 0.9rem;
                font-weight: 500;
                color: var(--gray);
                margin-bottom: 8px;
              }
              
              .status-item p {
                font-size: 1rem;
                font-weight: 500;
                color: var(--dark);
                display: flex;
                align-items: center;
              }
              
              .status-item p::before {
                content: '';
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--success);
                margin-right: 8px;
              }
              
              .endpoint-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 24px;
              }
              
              .endpoint-card {
                background-color: white;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                overflow: hidden;
                border: 1px solid var(--gray-light);
                transition: transform 0.2s, box-shadow 0.2s;
              }
              
              .endpoint-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              }
              
              .endpoint-header {
                padding: 16px 20px;
                background-color: var(--light);
                border-bottom: 1px solid var(--gray-light);
              }
              
              .endpoint-name {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--primary-dark);
                margin: 0;
              }
              
              .endpoint-body {
                padding: 20px;
              }
              
              .endpoint-description {
                margin-bottom: 16px;
                color: var(--dark);
              }
              
              .code-block {
                background-color: var(--dark);
                color: white;
                border-radius: var(--radius);
                padding: 16px;
                overflow-x: auto;
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.9rem;
                line-height: 1.5;
              }
              
              .code-block .comment {
                color: var(--gray);
              }
              
              .code-block .string {
                color: #a5d6ff;
              }
              
              .code-block .keyword {
                color: #ff7b72;
              }
              
              .code-block .property {
                color: #d2a8ff;
              }
              
              .section {
                margin-bottom: 40px;
              }
              
              .section-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 24px;
                color: var(--dark);
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .section-title::before {
                content: '';
                display: block;
                width: 4px;
                height: 24px;
                background-color: var(--primary);
                border-radius: 4px;
              }
              
              .cli-commands {
                background-color: var(--dark);
                color: white;
                border-radius: var(--radius);
                padding: 20px;
                margin-top: 16px;
              }
              
              .cli-commands pre {
                margin: 0;
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.9rem;
                line-height: 1.6;
              }
              
              .cli-title {
                font-size: 1rem;
                font-weight: 500;
                margin-bottom: 12px;
                color: var(--gray-light);
              }
              
              footer {
                background-color: var(--dark);
                color: white;
                padding: 40px 0;
              }
              
              .footer-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              
              .footer-logo {
                font-size: 1.2rem;
                font-weight: 700;
              }
              
              .footer-links a {
                color: var(--gray-light);
                text-decoration: none;
                margin-left: 24px;
                transition: color 0.2s;
              }
              
              .footer-links a:hover {
                color: white;
              }
              
              .footer-message {
                margin-top: 30px;
                text-align: center;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 30px;
              }
              
              .footer-message-content {
                max-width: 600px;
                margin: 0 auto;
              }
              
              .company-name {
                font-weight: 600;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
              }
              
              .message-text {
                font-size: 0.9rem;
                opacity: 0.8;
                line-height: 1.6;
              }
              
              .message-text a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s, border-bottom 0.2s;
                border-bottom: 1px solid transparent;
              }
              
              .message-text a:hover {
                color: var(--primary-dark);
                border-bottom: 1px solid var(--primary-dark);
              }
              
              .copyright {
                font-size: 0.8rem;
                margin-top: 15px;
                opacity: 0.6;
              }
              
              .heart {
                color: #ff6b6b;
                display: inline-block;
                animation: heartbeat 1.5s infinite;
              }
              
              @keyframes heartbeat {
                0% { transform: scale(1); }
                5% { transform: scale(1.2); }
                10% { transform: scale(1); }
                15% { transform: scale(1.2); }
                20% { transform: scale(1); }
                100% { transform: scale(1); }
              }
              
              @media (max-width: 768px) {
                header {
                  padding: 40px 0 60px;
                }
                
                h1 {
                  font-size: 2rem;
                }
                
                .endpoint-list {
                  grid-template-columns: 1fr;
                }
                
                .footer-content {
                  flex-direction: column;
                  gap: 20px;
                }
                
                .footer-links {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }
                
                .footer-links a {
                  margin-left: 0;
                }
              }
            </style>
          </head>
          <body>
            <header>
              <div class="container header-content">
                <div class="status-badge">Server Online</div>
                <h1>Payload CMS MCP Server</h1>
                <p class="subtitle">Server-Sent Events (SSE) and API endpoints for the Payload CMS Model Control Primitive (MCP)</p>
              </div>
            </header>
            
            <main class="container">
              <section class="section">
                <div class="card">
                  <div class="card-header">
                    <h2 class="card-title">Server Status</h2>
                  </div>
                  <div class="card-body">
                    <div class="status-card">
                      <div class="status-item">
                        <h3>Server</h3>
                        <p>Running at http://localhost:${PORT}</p>
                      </div>
                      <div class="status-item">
                        <h3>SSE Endpoint</h3>
                        <p>Active at http://localhost:${PORT}/sse</p>
                      </div>
                      <div class="status-item">
                        <h3>API Status</h3>
                        <p>All endpoints operational</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <section class="section">
                <h2 class="section-title">Available Endpoints</h2>
                <div class="endpoint-list">
                  <div class="endpoint-card">
                    <div class="endpoint-header">
                      <h3 class="endpoint-name">/sse</h3>
                    </div>
                    <div class="endpoint-body">
                      <p class="endpoint-description">Server-Sent Events endpoint for real-time communication with Cursor IDE.</p>
                      <div class="code-block">
                        <span class="keyword">const</span> eventSource = <span class="keyword">new</span> EventSource(<span class="string">'http://localhost:${PORT}/sse'</span>);
                      </div>
                    </div>
                  </div>
                  
                  <div class="endpoint-card">
                    <div class="endpoint-header">
                      <h3 class="endpoint-name">/api/validate</h3>
                    </div>
                    <div class="endpoint-body">
                      <p class="endpoint-description">Validates Payload CMS code against best practices and patterns.</p>
                      <div class="code-block">
                        fetch(<span class="string">'http://localhost:${PORT}/api/validate'</span>, {
                          <span class="property">method</span>: <span class="string">'POST'</span>,
                          <span class="property">headers</span>: { <span class="string">'Content-Type'</span>: <span class="string">'application/json'</span> },
                          <span class="property">body</span>: JSON.stringify({
                            <span class="property">code</span>: <span class="string">"module.exports = { slug: 'posts', fields: [] }"</span>,
                            <span class="property">fileType</span>: <span class="string">"collection"</span>
                          })
                        });
                      </div>
                    </div>
                  </div>
                  
                  <div class="endpoint-card">
                    <div class="endpoint-header">
                      <h3 class="endpoint-name">/api/query</h3>
                    </div>
                    <div class="endpoint-body">
                      <p class="endpoint-description">Queries validation rules for Payload CMS components.</p>
                      <div class="code-block">
                        fetch(<span class="string">'http://localhost:${PORT}/api/query'</span>, {
                          <span class="property">method</span>: <span class="string">'POST'</span>,
                          <span class="property">headers</span>: { <span class="string">'Content-Type'</span>: <span class="string">'application/json'</span> },
                          <span class="property">body</span>: JSON.stringify({
                            <span class="property">query</span>: <span class="string">"list rules"</span>,
                            <span class="property">fileType</span>: <span class="string">"collection"</span>
                          })
                        });
                      </div>
                    </div>
                  </div>
                  
                  <div class="endpoint-card">
                    <div class="endpoint-header">
                      <h3 class="endpoint-name">/api/mcp_query</h3>
                    </div>
                    <div class="endpoint-body">
                      <p class="endpoint-description">Executes SQL-like MCP queries to retrieve specific information.</p>
                      <div class="code-block">
                        fetch(<span class="string">'http://localhost:${PORT}/api/mcp_query'</span>, {
                          <span class="property">method</span>: <span class="string">'POST'</span>,
                          <span class="property">headers</span>: { <span class="string">'Content-Type'</span>: <span class="string">'application/json'</span> },
                          <span class="property">body</span>: JSON.stringify({
                            <span class="property">sql</span>: <span class="string">"LIST RULES FOR \\"collection\\""</span>
                          })
                        });
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <section class="section">
                <h2 class="section-title">Cursor IDE Integration</h2>
                <div class="card">
                  <div class="card-body">
                    <p>To integrate with Cursor IDE, configure the IDE to use the following URL for the SSE transport:</p>
                    <div class="code-block" style="margin-top: 16px;">
                      http://localhost:${PORT}/sse
                    </div>
                  </div>
                </div>
              </section>
              
              <section class="section">
                <h2 class="section-title">CLI Commands</h2>
                <p>You can also use the Payload CMS MCP CLI to interact with this server:</p>
                <div class="cli-commands">
                  <div class="cli-title">Validate a Payload CMS file:</div>
                  <pre>npx @payloadcmsmcp.info validate ./collections/Posts.js</pre>
                  
                  <div class="cli-title" style="margin-top: 16px;">Query validation rules:</div>
                  <pre>npx @payloadcmsmcp.info query "list rules" collection</pre>
                  
                  <div class="cli-title" style="margin-top: 16px;">Execute an MCP query:</div>
                  <pre>npx @payloadcmsmcp.info mcp "LIST RULES FOR \\"collection\\""</pre>
                </div>
              </section>
            </main>
            
            <footer>
              <div class="container footer-content">
                <div class="footer-logo">Payload CMS MCP Server</div>
                <div class="footer-links">
                  <a href="https://github.com/Matmax-Worldwide/payloadcmsmcp" target="_blank">GitHub Repository</a>
                  <a href="https://www.payloadcms.com" target="_blank">Payload CMS</a>
                  <a href="https://cursor.sh" target="_blank">Cursor IDE</a>
                </div>
              </div>
              <div class="container footer-message">
                <div class="footer-message-content">
                  <div class="company-name">MATMAX WORLDWIDE</div>
                  <p class="message-text">
                    Creating technology that helps humans be more human. We believe in tech for good—tools that enhance 
                    our lives while respecting our humanity. Join us in building a future where technology serves wellness, 
                    connection, and purpose. Together, we can create digital experiences that bring out the best in us all.
                  </p>
                  <p class="message-text" style="margin-top: 15px;">
                    Visit <a href="https://matmax.world" target="_blank">matmax.world</a> to explore our vision for human-centered technology and join our community dedicated to wellness and meaningful innovation.
                  </p>
                  <p class="copyright">
                    © ${new Date().getFullYear()} MATMAX WORLDWIDE. Made with <span class="heart">❤️</span> for humanity.
                  </p>
                </div>
              </div>
            </footer>
          </body>
          </html>
        `);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    }
  });
  
  server.listen(PORT, () => {
    console.log(`Payload CMS MCP SSE Server running at http://localhost:${PORT}`);
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`API endpoints:`);
    console.log(`  - http://localhost:${PORT}/api/validate`);
    console.log(`  - http://localhost:${PORT}/api/query`);
    console.log(`  - http://localhost:${PORT}/api/mcp_query`);
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
}

// Start the server
startServer(); 