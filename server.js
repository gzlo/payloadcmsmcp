import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files (your HTML page)
app.use(express.static(path.join(__dirname)));

// Serve the HTML page as the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the Express server
const server = app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// Start the MCP server in a separate process
const mcpProcess = spawn('node', ['build/index.js', process.env.RAILWAY_API_TOKEN], {
  stdio: 'inherit'
});

mcpProcess.on('error', (err) => {
  console.error('Failed to start MCP process:', err);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Web server closed');
  });
  mcpProcess.kill();
}); 