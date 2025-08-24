#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting aggressive Vercel build...');

try {
  // Set environment variables
  process.env.NODE_ENV = 'production';
  process.env.VITE_USE_ESBUILD = 'true';
  
  console.log('🧹 Cleaning up previous installation...');
  
  // Remove node_modules and package-lock.json if they exist
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit', cwd: process.cwd() });
  }
  if (fs.existsSync('package-lock.json')) {
    execSync('rm -f package-lock.json', { stdio: 'inherit', cwd: process.cwd() });
  }
  
  console.log('📦 Installing dependencies with aggressive flags...');
  
  // Install dependencies with multiple flags to avoid Rollup issues
  execSync('npm install --ignore-scripts --no-optional --no-audit --no-fund --production=false', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('🔨 Building with Vite (esbuild mode)...');
  
  // Set environment to force esbuild
  process.env.VITE_USE_ESBUILD = 'true';
  process.env.ESBUILD_BINARY_PATH = 'node_modules/esbuild/bin/esbuild';
  
  // Run vite build
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      VITE_USE_ESBUILD: 'true',
      ESBUILD_BINARY_PATH: 'node_modules/esbuild/bin/esbuild'
    }
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try fallback approach
  console.log('🔄 Trying fallback build approach...');
  
  try {
    // Try building with esbuild directly
    execSync('npx esbuild src/main.tsx --bundle --outdir=dist --format=esm --target=esnext --minify', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Fallback build completed successfully!');
  } catch (fallbackError) {
    console.error('❌ Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}
