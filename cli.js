#!/usr/bin/env node

/**
 * Payload CMS MCP CLI
 * 
 * A command-line interface for interacting with the Payload CMS MCP server
 * at payloadcmsmcp.info
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

// Server URL
const SERVER_URL = 'https://www.payloadcmsmcp.info';
const SSE_SERVER_URL = 'https://www.payloadcmsmcp.info';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Validates Payload CMS code
 * @param {string} code - The code to validate
 * @param {string} fileType - The type of file (e.g., 'collection', 'field')
 * @returns {Promise<object>} - The validation result
 */
async function validateCode(code, fileType) {
  try {
    const response = await fetch(`${SERVER_URL}/api/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, fileType }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error validating code:', error);
    throw new Error(`Failed to validate code: ${error.message}`);
  }
}

/**
 * Queries validation rules
 * @param {string} query - The query string
 * @param {string} fileType - The type of file (e.g., 'collection', 'field')
 * @returns {Promise<object>} - The query result
 */
async function queryRules(query, fileType) {
  try {
    const response = await fetch(`${SERVER_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, fileType }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error querying rules:', error);
    throw new Error(`Failed to query rules: ${error.message}`);
  }
}

/**
 * Executes an MCP query (SQL-like)
 * @param {string} sql - The SQL-like query
 * @returns {Promise<object>} - The query result
 */
async function mcpQuery(sql) {
  try {
    const response = await fetch(`${SERVER_URL}/api/mcp_query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error executing MCP query:', error);
    throw new Error(`Failed to execute MCP query: ${error.message}`);
  }
}

/**
 * Reads a file and returns its contents
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - File contents
 */
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

/**
 * Determines the file type based on file path and content
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {string} - File type ('collection', 'field', or 'unknown')
 */
function determineFileType(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  
  if (fileName.includes('collection') || filePath.includes('collections')) {
    return 'collection';
  } else if (fileName.includes('field') || filePath.includes('fields')) {
    return 'field';
  } else if (content.includes('CollectionConfig') || content.includes('export const') && content.includes('fields')) {
    return 'collection';
  } else if (content.includes('Field') || content.includes('type:')) {
    return 'field';
  }
  
  return 'unknown';
}

/**
 * Displays validation results in a user-friendly format
 * @param {object} result - Validation result
 */
function displayValidationResult(result) {
  console.log('\n=== Validation Result ===');
  
  if (result.valid === true) {
    console.log('✅ Code is valid!');
    return;
  }
  
  if (result.messages && result.messages.length > 0) {
    console.log('\n🔍 Issues:');
    result.messages.forEach((message, index) => {
      console.log(`  ${index + 1}. ${message.text || message}`);
    });
  }
  
  if (result.suggestions && result.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    result.suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion.text || suggestion}`);
      if (suggestion.description) {
        console.log(`     ${suggestion.description}`);
      }
      if (suggestion.code) {
        console.log(`     Example: ${suggestion.code}`);
      }
    });
  }
  
  if (result.reference) {
    console.log(`\n📚 Reference: ${result.reference}`);
  }
}

/**
 * Displays query results in a user-friendly format
 * @param {object} result - Query result
 */
function displayQueryResult(result) {
  console.log('\n=== Query Result ===');
  
  if (!result.success && result.error) {
    console.log(`❌ Error: ${result.error}`);
    return;
  }
  
  if (result.data && result.data.rules) {
    console.log(`\n📋 Found ${result.data.rules.length} rules:`);
    result.data.rules.forEach((rule, index) => {
      console.log(`\n  ${index + 1}. ${rule.id}`);
      console.log(`     Description: ${rule.description}`);
      console.log(`     Applies to: ${rule.appliesTo.join(', ')}`);
    });
  } else if (result.results) {
    console.log(`\n📋 Found ${result.results.length} results:`);
    result.results.forEach((item, index) => {
      console.log(`\n  ${index + 1}. ${item.id}`);
      console.log(`     Description: ${item.description}`);
      console.log(`     Applies to: ${item.appliesTo}`);
    });
  } else {
    console.log('No results found.');
  }
}

/**
 * Starts the SSE server
 * @param {number} port - The port to run the server on
 */
function startSSEServer(port) {
  const serverPath = path.join(__dirname, 'sse-server.js');
  
  // Make the server file executable
  try {
    fs.chmodSync(serverPath, '755');
  } catch (error) {
    console.error(`Error making server file executable: ${error.message}`);
  }
  
  // Set the port if provided
  const env = { ...process.env };
  if (port) {
    env.PORT = port;
  }
  
  // Start the server
  const server = spawn('node', [serverPath], {
    env,
    stdio: 'inherit'
  });
  
  server.on('error', (error) => {
    console.error(`Failed to start server: ${error.message}`);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit(0);
  });
}

/**
 * Displays help information
 */
function showHelp() {
  console.log(`
Payload CMS MCP CLI

Usage:
  npx @payloadcmsmcp.info [command] [options]

Commands:
  validate <file>          Validate a Payload CMS file
  query <query> [fileType] Query validation rules
  mcp <sql>                Execute an MCP query
  server [port]            Start the SSE server for Cursor IDE
  help                     Show this help message

Examples:
  npx @payloadcmsmcp.info validate ./collections/Posts.js
  npx @payloadcmsmcp.info query "list rules" collection
  npx @payloadcmsmcp.info mcp "LIST RULES FOR \\"collection\\""
  npx @payloadcmsmcp.info server 3002
  `);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help') {
    showHelp();
    rl.close();
    return;
  }
  
  try {
    switch (command) {
      case 'validate': {
        const filePath = args[1];
        
        if (!filePath) {
          console.error('Error: File path is required');
          showHelp();
          break;
        }
        
        try {
          const code = await readFile(filePath);
          const fileType = args[2] || determineFileType(filePath, code);
          
          console.log(`Validating ${filePath} as ${fileType}...`);
          const result = await validateCode(code, fileType);
          displayValidationResult(result);
        } catch (error) {
          console.error(`Error reading file: ${error.message}`);
        }
        break;
      }
      
      case 'query': {
        const query = args[1];
        const fileType = args[2];
        
        if (!query) {
          console.error('Error: Query is required');
          showHelp();
          break;
        }
        
        console.log(`Querying rules with "${query}"${fileType ? ` for ${fileType}` : ''}...`);
        const result = await queryRules(query, fileType);
        displayQueryResult(result);
        break;
      }
      
      case 'mcp': {
        const sql = args[1];
        
        if (!sql) {
          console.error('Error: SQL query is required');
          showHelp();
          break;
        }
        
        console.log(`Executing MCP query: ${sql}`);
        const result = await mcpQuery(sql);
        displayQueryResult(result);
        break;
      }
      
      case 'server': {
        const port = args[1] ? parseInt(args[1], 10) : null;
        
        if (port && isNaN(port)) {
          console.error('Error: Port must be a number');
          showHelp();
          break;
        }
        
        console.log(`Starting SSE server${port ? ` on port ${port}` : ''}...`);
        startSSEServer(port);
        // Don't close readline as the server will keep running
        return;
      }
      
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
}); 