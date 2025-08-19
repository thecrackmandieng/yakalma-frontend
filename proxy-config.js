// Proxy configuration for production
const proxyConfig = {
  '/api': {
    target: 'https://yakalma.onrender.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/api': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'https://yakalma-frontend.onrender.com');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }
};

module.exports = proxyConfig;
