/**
 * Helper script to update API IP address in config.ts
 * Run: node scripts/update-ip.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Detect OS and get IP address
function getLocalIP() {
  try {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Skip internal (loopback) and non-IPv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    console.error('Error detecting IP:', error);
  }
  return null;
}

// Get IP from command line or auto-detect
const args = process.argv.slice(2);
let newIP = args[0];

if (!newIP) {
  newIP = getLocalIP();
  if (!newIP) {
    console.error('Could not auto-detect IP. Please provide it manually:');
    console.error('Usage: node scripts/update-ip.js <IP_ADDRESS>');
    console.error('Example: node scripts/update-ip.js 192.168.1.15');
    process.exit(1);
  }
  console.log(`Auto-detected IP: ${newIP}`);
} else {
  console.log(`Using provided IP: ${newIP}`);
}

// Read config file
const configPath = path.join(__dirname, '../src/config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

// Update IP address
const ipRegex = /const DEV_API_IP = "[\d.]+";/;
if (ipRegex.test(configContent)) {
  configContent = configContent.replace(ipRegex, `const DEV_API_IP = "${newIP}";`);
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log(`✅ Updated API IP to ${newIP} in ${configPath}`);
} else {
  console.error('❌ Could not find DEV_API_IP in config file');
  process.exit(1);
}

