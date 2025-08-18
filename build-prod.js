#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting production build...');

try {
  // Build the application
  console.log('📦 Building Angular application...');
  execSync('npm run build:prod', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Production build completed successfully!');
  console.log('📊 Build output location: dist/yakalma-frontend/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
