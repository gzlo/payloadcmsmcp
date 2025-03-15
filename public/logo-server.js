const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Set CORS headers to allow access from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle the root path
  if (req.url === '/' || req.url === '/logo-generator') {
    fs.readFile(path.join(__dirname, 'logo-generator.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading logo generator: ${err.message}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  // Handle requests for files in the public directory
  const filePath = path.join(__dirname, req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end(`File not found: ${req.url}`);
      return;
    }

    // Determine the content type based on file extension
    let contentType = 'text/plain';
    const ext = path.extname(filePath);
    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Logo generator server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/logo-generator in your browser to create your logo`);
}); 