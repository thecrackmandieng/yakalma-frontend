#!/bin/bash
echo "🔍 Checking deployment readiness..."
echo "📁 Checking dist directory..."
ls -la dist/
echo "📁 Checking browser directory..."
ls -la dist/yakalma-frontend/browser/
echo "📁 Checking server directory..."
ls -la dist/yakalma-frontend/server/
echo "✅ Deployment check complete"
