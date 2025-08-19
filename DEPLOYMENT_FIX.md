# Deployment Fix for ENOENT Error

## Problem
Error: ENOENT: no such file or directory, stat '/opt/render/project/src/dist/yakalma-frontend/browser/index.html'

## Root Cause
The deployment is looking for a static `index.html` file but the Angular Universal SSR setup should be serving the application through the Node.js server.

## Solution
Ensure the build output structure matches the Angular Universal SSR configuration and the deployment uses the correct server file.

## Steps to Fix

### ✅ Completed
1. ✅ Analyzed build configuration in `angular.json`
2. ✅ Verified render.yaml configuration
3. ✅ Created deployment fix script
4. ✅ Updated package.json scripts
5. ✅ Created deployment check script

### 🔄 Next Steps
1. **Build the application**:
   ```bash
   npm run build:ssr
   ```

2. **Verify build output**:
   ```bash
   ./check-deployment.sh
   ```

3. **Test locally**:
   ```bash
   npm run serve:ssr
   ```

4. **Deploy to Render**:
   - Push changes to git
   - Render will automatically deploy

### Expected Build Structure
```
dist/
└── yakalma-frontend/
    ├── browser/
    │   ├── index.html
    │   ├── favicon.ico
    │   └── assets/
    └── server/
        └── server.mjs
```

### Server Configuration
- **SSR Server**: `dist/yakalma-frontend/server/server.mjs`
- **Static Files**: `dist/yakalma-frontend/browser/`
- **Port**: Environment variable PORT (default 4000)

### Environment Variables
- NODE_ENV: production
- NODE_OPTIONS: --max-old-space-size=384

## Testing
After deployment, verify:
- [ ] No ENOENT errors in logs
- [ ] Application loads correctly at the deployment URL
- [ ] SSR functionality works (view source shows server-rendered content)
- [ ] Static assets load correctly

## Troubleshooting
If issues persist:
1. Check Render logs for specific error messages
2. Verify build output structure matches expected
3. Ensure all dependencies are installed
4. Check environment variables are set correctly
