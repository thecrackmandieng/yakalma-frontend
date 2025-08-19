// Production server for deployment
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yakalma-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy middleware for API calls
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://yakalma.onrender.com',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying: ${req.method} ${req.url} -> https://yakalma.onrender.com${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

// Use the proxy
app.use('/api', apiProxy);

// Determine the correct dist path
const distPath = path.join(__dirname, 'dist', 'yakalma-frontend', 'browser');
const indexPath = path.join(distPath, 'index.html');

console.log('🚀 Starting Yakalma Frontend Server...');
console.log('📁 Dist path:', distPath);
console.log('📄 Index path:', indexPath);

// Check if dist directory exists
if (!require('fs').existsSync(distPath)) {
  console.error('❌ Dist directory not found:', distPath);
  console.error('Please run: npm run build:ssr');
  process.exit(1);
}

// Check if index.html exists
if (!require('fs').existsSync(indexPath)) {
  console.error('❌ index.html not found:', indexPath);
  console.error('Please run: npm run build:ssr');
  process.exit(1);
}

// Serve static files
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle all routes with Angular app
app.get('*', (req, res) => {
  console.log(`📡 Serving: ${req.method} ${req.url}`);
  res.sendFile(indexPath);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Available at: http://localhost:${PORT}`);
});
