#!/usr/bin/env node
/**
 * Script to start the bias classification service
 * Used for development with npm run bias:start
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the bias classifier service
const servicePath = join(__dirname, '..', 'src', 'services', 'bias-classifier');
const startScript = join(servicePath, 'start_service.py');

console.log('🚀 Starting Bias Classification Service...');
console.log(`📍 Service path: ${servicePath}`);
console.log(`🔧 Using HuggingFace model: samuelra/Roberta_biass_classifier`);

// Check if Python is available
const pythonCommands = ['python', 'python3', 'py'];

async function findPython() {
  for (const cmd of pythonCommands) {
    try {
      const result = await new Promise((resolve) => {
        const process = spawn(cmd, ['--version'], { stdio: 'pipe' });
        process.on('close', (code) => resolve(code === 0 ? cmd : null));
        process.on('error', () => resolve(null));
      });
      if (result) {
        console.log(`✅ Found Python: ${cmd}`);
        return cmd;
      }
    } catch (error) {
      // Continue to next command
    }
  }
  return null;
}

async function startService() {
  const pythonCmd = await findPython();
  
  if (!pythonCmd) {
    console.error('❌ Python not found. Please install Python 3.8+ to run the bias classification service.');
    console.error('   Download from: https://www.python.org/downloads/');
    process.exit(1);
  }

  console.log('📦 Starting service (this may take a moment to download the model on first run)...');
  
  const serviceProcess = spawn(pythonCmd, [startScript], {
    cwd: servicePath,
    stdio: 'inherit', // Forward all output to parent process
    shell: process.platform === 'win32' // Use shell on Windows
  });

  serviceProcess.on('error', (error) => {
    console.error('❌ Failed to start bias service:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('💡 Make sure Python dependencies are installed:');
      console.error('   cd src/services/bias-classifier');
      console.error('   pip install -r requirements.txt');
    }
    
    process.exit(1);
  });

  serviceProcess.on('exit', (code, signal) => {
    if (signal) {
      console.log(`📴 Bias service stopped by signal: ${signal}`);
    } else if (code !== 0) {
      console.error(`❌ Bias service exited with code: ${code}`);
      process.exit(code);
    } else {
      console.log('📴 Bias service stopped cleanly');
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bias service...');
    serviceProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down bias service...');
    serviceProcess.kill('SIGTERM');
  });
}

startService().catch((error) => {
  console.error('❌ Error starting bias service:', error);
  process.exit(1);
});
