#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting esbuild-only Vercel build...');

try {
  // Set environment variables
  process.env.NODE_ENV = 'production';
  process.env.VITE_USE_ESBUILD = 'true';
  
  console.log('📦 Installing dependencies with --no-optional...');
  
  // Install dependencies without optional packages
  execSync('npm ci --ignore-scripts --no-optional', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('🔨 Building with esbuild directly...');
  
  // Create a simple esbuild build script
  const esbuildConfig = `
import * as esbuild from 'esbuild';
import { readdirSync } from 'fs';
import { join } from 'path';

// Find all entry points
const srcDir = './src';
const entryPoints = [];

function findEntryPoints(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      findEntryPoints(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      if (file.name === 'main.tsx' || file.name === 'index.tsx') {
        entryPoints.push(fullPath);
      }
    }
  }
}

findEntryPoints(srcDir);

if (entryPoints.length === 0) {
  entryPoints.push('./src/main.tsx');
}

console.log('Entry points:', entryPoints);

// Build with esbuild
await esbuild.build({
  entryPoints,
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'esnext',
  minify: true,
  sourcemap: false,
  external: [],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('Build completed!');
`;

  // Write the esbuild config
  fs.writeFileSync('esbuild-build.mjs', esbuildConfig);
  
  // Run esbuild build
  execSync('node esbuild-build.mjs', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Clean up
  fs.unlinkSync('esbuild-build.mjs');
  
  console.log('✅ Build completed successfully with esbuild!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
