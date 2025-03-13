#!/usr/bin/env node

/**
 * Simple test script for the Payload CMS MCP CLI
 */

const { execSync } = require('child_process');
const path = require('path');

// Test the CLI help command
console.log('Testing CLI help command...');
try {
  const helpOutput = execSync('node cli.js help', { encoding: 'utf8' });
  if (helpOutput.includes('Payload CMS MCP CLI') && 
      helpOutput.includes('validate') && 
      helpOutput.includes('query') && 
      helpOutput.includes('mcp') && 
      helpOutput.includes('server')) {
    console.log('✅ Help command test passed');
  } else {
    console.error('❌ Help command test failed');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Help command test failed:', error.message);
  process.exit(1);
}

// Test the CLI version
console.log('Testing CLI version...');
try {
  const packageJson = require('./package.json');
  console.log(`✅ CLI version: ${packageJson.version}`);
} catch (error) {
  console.error('❌ Version test failed:', error.message);
  process.exit(1);
}

console.log('All tests passed!'); 