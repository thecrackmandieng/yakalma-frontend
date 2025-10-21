#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing deployment configuration...');

// Ensure build output structure is correct
const distPath = path.join(__dirname, 'dist');
const yakalmaPath = path.join(distPath, 'yakalma-frontend');
const browserPath = path.join(yakalmaPath, 'browser');
const serverPath = path.join(yakalmaPath, 'server');

// Create directories if they don't exist
const dirs = [distPath, yakalmaPath, browserPath, serverPath];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create a simple index.html if missing (fallback)
const indexPath = path.join(browserPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yakalma - Commande de repas</title>
    <base href="/">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
    <app-root>Loading...</app-root>
</body>
</html>`;
  fs.writeFileSync(indexPath, fallbackHtml);
  console.log('✅ Created fallback index.html');
}

// Update package.json scripts to ensure correct build
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Ensure build scripts are correct
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "ng build --configuration production",
  "build:ssr": "ng build --configuration production",
  "serve:ssr": "node dist/yakalma-frontend/server/server.mjs",
  "start": "node dist/yakalma-frontend/server/server.mjs"
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json scripts');

// Create a deployment check script
const checkScript = `#!/bin/bash
echo "🔍 Checking deployment readiness..."
echo "📁 Checking dist directory..."
ls -la dist/
echo "📁 Checking browser directory..."
ls -la dist/yakalma-frontend/browser/
echo "📁 Checking server directory..."
ls -la dist/yakalma-frontend/server/
echo "✅ Deployment check complete"
`;

fs.writeFileSync('check-deployment.sh', checkScript);
fs.chmodSync('check-deployment.sh', '755');
console.log('✅ Created deployment check script');

console.log('🎉 Deployment configuration fixed!');
console.log('Next steps:');
console.log('1. Run: npm run build:ssr');
console.log('2. Run: ./check-deployment.sh');
console.log('3. Deploy to Render');
