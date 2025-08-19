const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'dist', 'yakalma-frontend', 'server', 'server.mjs');

console.log('Checking build output...');
console.log('Server file path:', serverPath);

if (fs.existsSync(serverPath)) {
  console.log('✅ Server file exists');
  const stats = fs.statSync(serverPath);
  console.log('📊 Server file size:', Math.round(stats.size / 1024) + 'KB');
} else {
  console.log('❌ Server file NOT found');
  console.log('Available files in dist:');
  try {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath, { recursive: true });
      files.forEach(file => console.log('  -', file));
    } else {
      console.log('  dist directory does not exist');
    }
  } catch (e) {
    console.log('  Error reading dist directory:', e.message);
  }
}
