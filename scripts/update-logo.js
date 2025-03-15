const fs = require('fs');
const path = require('path');

// Path to the index.html file
const indexPath = path.join(__dirname, '..', 'public', 'index.html');

// Read the index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Replace the logo image source
  const updatedHtml = data.replace(
    /<img src="\/logopayload.png" alt="Payload CMS 3.0 Logo" class="logo-image" width="60" height="60" loading="eager">/g,
    '<img src="/matmax-payload-mcp-logo.png" alt="Matmax Payload CMS MCP Server" class="logo-image" width="80" height="60" loading="eager">'
  );

  // Write the updated HTML back to the file
  fs.writeFile(indexPath, updatedHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('Successfully updated the logo in index.html');
    console.log('Make sure to place your new logo file (matmax-payload-mcp-logo.png) in the public directory');
  });
}); 