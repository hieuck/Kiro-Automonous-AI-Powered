#!/usr/bin/env node
/**
 * Quality Watcher - Continuous Background Monitoring
 * Watches for file changes and runs quality checks automatically
 */

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  watchPaths: [
    'muh5/packages/server/src/**/*.ts',
    'muh5/packages/client/src/**/*.ts',
  ],
  ignorePaths: [
    '**/node_modules/**',
    '**/dist/**',
    '**/__tests__/**',
    '**/coverage/**',
  ],
  debounceDelay: 2000, // Wait 2s after last change
  logFile: path.join(__dirname, '../logs/quality-watcher.log'),
};

// State
let debounceTimer = null;
let changedFiles = new Set();

/**
 * Log message
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  // Ensure log directory exists
  const logDir = path.dirname(CONFIG.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(CONFIG.logFile, logMessage + '\n');
  console.log(logMessage);
}

/**
 * Run quality checks on changed files
 */
function runQualityChecks(files) {
  log(`Running quality checks on ${files.length} files...`);
  
  const fileList = Array.from(files).join(' ');
  
  try {
    // Run ESLint
    log('Running ESLint...');
    execSync(`npx eslint ${fileList} --fix`, {
      cwd: path.join(__dirname, '../../muh5'),
      stdio: 'inherit',
    });
    log('✅ ESLint passed');
    
    // Run TypeScript check
    log('Running TypeScript check...');
    execSync('npx tsc --noEmit', {
      cwd: path.join(__dirname, '../../muh5'),
      stdio: 'inherit',
    });
    log('✅ TypeScript check passed');
    
    log('✅ All quality checks passed');
  } catch (error) {
    log(`⚠️  Quality checks failed: ${error.message}`);
  }
  
  // Clear changed files
  changedFiles.clear();
}

/**
 * Handle file change
 */
function handleFileChange(filePath) {
  log(`File changed: ${filePath}`);
  changedFiles.add(filePath);
  
  // Debounce: wait for more changes
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    if (changedFiles.size > 0) {
      runQualityChecks(changedFiles);
    }
  }, CONFIG.debounceDelay);
}

/**
 * Start watcher
 */
function startWatcher() {
  log('🚀 Starting quality watcher...');
  log(`Watching: ${CONFIG.watchPaths.join(', ')}`);
  
  const watcher = chokidar.watch(CONFIG.watchPaths, {
    ignored: CONFIG.ignorePaths,
    persistent: true,
    ignoreInitial: true,
  });
  
  watcher
    .on('change', handleFileChange)
    .on('add', handleFileChange)
    .on('error', error => log(`❌ Watcher error: ${error}`))
    .on('ready', () => log('✅ Watcher ready'));
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('🛑 Stopping quality watcher...');
    watcher.close();
    process.exit(0);
  });
}

// Start watcher
startWatcher();
