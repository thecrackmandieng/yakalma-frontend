const express = require('express');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Paths
const DIST_FOLDER = path.join(process.cwd(), 'dist/yakalma-frontend/browser');
const INDEX_HTML = path.join(DIST_FOLDER, 'index.html');

// Create Express server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(DIST_FOLDER, {
  maxAge: '1y',
  index: 'index.html'
}));

// API routes (example)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all handler: send back Angular's index.html for client-side routing
app.get('*', (req, res) => {
  if (!fs.existsSync(INDEX_HTML)) {
    return res.status(404).json({
      error: 'Build not found',
      message: 'Run "npm run build" first'
    });
  }

  res.sendFile(INDEX_HTML);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
function run() {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📁 Serving files from: ${DIST_FOLDER}`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
run();

module.exports = app;
