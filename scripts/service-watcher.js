#!/usr/bin/env node
/**
 * Service Watcher - Auto Lint Fix & Build on Service Changes
 * Watches service files and automatically runs lint fix + build
 */

const chokidar = require('chokidar');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  watchPaths: [
    'muh5/packages/server/src/services/**/*.ts',
    'muh5/packages/server/src/types/**/*.ts',
    'muh5/packages/server/src/repositories/**/*.ts',
  ],
  ignorePaths: [
    '**/node_modules/**',
    '**/dist/**',
    '**/__tests__/**',
    '**/coverage/**',
    '**/*.test.ts',
    '**/*.property.ts',
  ],
  debounceDelay: 1000, // Wait 1s after last change
  logFile: path.join(__dirname, '../logs/service-watcher.log'),
  projectRoot: path.join(__dirname, '../../muh5'),
};

// State
let debounceTimer = null;
let changedFiles = new Set();
let isProcessing = false;

/**
 * Log message with color
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m',
  };
  
  const color = colors[type] || colors.info;
  const logMessage = `[${timestamp}] ${message}`;
  
  // Ensure log directory exists
  const logDir = path.dirname(CONFIG.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(CONFIG.logFile, logMessage + '\n');
  console.log(`${color}${logMessage}${colors.reset}`);
}

/**
 * Run command with real-time output
 */
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`${description}...`, 'info');
    
    const child = spawn(command, {
      cwd: CONFIG.projectRoot,
      shell: true,
      stdio: 'pipe',
    });
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${description} completed`, 'success');
        resolve({ success: true, output });
      } else {
        log(`❌ ${description} failed (exit code: ${code})`, 'error');
        reject({ success: false, output, code });
      }
    });
    
    child.on('error', (error) => {
      log(`❌ ${description} error: ${error.message}`, 'error');
      reject({ success: false, error: error.message });
    });
  });
}

/**
 * Run ESLint fix on changed files
 */
async function runLintFix(files) {
  const fileList = Array.from(files).join(' ');
  
  try {
    await runCommand(
      `npx eslint ${fileList} --fix`,
      'ESLint auto-fix'
    );
    return { success: true };
  } catch (error) {
    log('⚠️  ESLint fix had issues, continuing...', 'warning');
    return { success: false, error };
  }
}

/**
 * Run TypeScript build
 */
async function runBuild() {
  try {
    await runCommand(
      'npm run build:server',
      'TypeScript build'
    );
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Run tests for changed services
 */
async function runTests(files) {
  // Extract service names from file paths
  const serviceNames = Array.from(files)
    .map(f => {
      const match = f.match(/services\/([^/]+)\.ts$/);
      return match ? match[1] : null;
    })
    .filter(Boolean);
  
  if (serviceNames.length === 0) {
    log('No service files to test', 'info');
    return { success: true };
  }
  
  try {
    const testPattern = serviceNames.join('|');
    await runCommand(
      `npm test -- --testPathPattern="${testPattern}" --passWithNoTests`,
      'Running tests'
    );
    return { success: true };
  } catch (error) {
    log('⚠️  Tests failed, but continuing...', 'warning');
    return { success: false, error };
  }
}

/**
 * Process changed files
 */
async function processChanges() {
  if (isProcessing) {
    log('Already processing, skipping...', 'warning');
    return;
  }
  
  if (changedFiles.size === 0) {
    return;
  }
  
  isProcessing = true;
  const files = Array.from(changedFiles);
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log(`🔄 Processing ${files.length} changed file(s)`, 'info');
  files.forEach(f => log(`   - ${f}`, 'info'));
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Lint fix
    log('📝 Step 1/3: Auto-fixing lint issues...', 'info');
    await runLintFix(files);
    
    // Step 2: Build
    log('🔨 Step 2/3: Building TypeScript...', 'info');
    await runBuild();
    
    // Step 3: Run tests
    log('🧪 Step 3/3: Running tests...', 'info');
    await runTests(files);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
    log(`✅ All steps completed in ${duration}s`, 'success');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error');
    log(`❌ Process failed after ${duration}s`, 'error');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error');
  } finally {
    changedFiles.clear();
    isProcessing = false;
  }
}

/**
 * Handle file change
 */
function handleFileChange(filePath, event) {
  const relativePath = path.relative(process.cwd(), filePath);
  log(`📄 ${event}: ${relativePath}`, 'info');
  
  changedFiles.add(relativePath);
  
  // Debounce: wait for more changes
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    processChanges();
  }, CONFIG.debounceDelay);
}

/**
 * Start watcher
 */
function startWatcher() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('🚀 Service Watcher Started', 'success');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('Watching:', 'info');
  CONFIG.watchPaths.forEach(p => log(`   - ${p}`, 'info'));
  log('', 'info');
  log('Actions on change:', 'info');
  log('   1. Auto-fix ESLint issues', 'info');
  log('   2. Build TypeScript', 'info');
  log('   3. Run related tests', 'info');
  log('', 'info');
  log('Press Ctrl+C to stop', 'warning');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  
  const watcher = chokidar.watch(CONFIG.watchPaths, {
    ignored: CONFIG.ignorePaths,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  });
  
  watcher
    .on('change', (path) => handleFileChange(path, 'Changed'))
    .on('add', (path) => handleFileChange(path, 'Added'))
    .on('unlink', (path) => {
      const relativePath = path.relative(process.cwd(), path);
      log(`🗑️  Deleted: ${relativePath}`, 'warning');
    })
    .on('error', error => log(`❌ Watcher error: ${error}`, 'error'))
    .on('ready', () => log('✅ Watcher ready, monitoring for changes...', 'success'));
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('', 'info');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'warning');
    log('🛑 Stopping service watcher...', 'warning');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'warning');
    watcher.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('🛑 Received SIGTERM, stopping...', 'warning');
    watcher.close();
    process.exit(0);
  });
}

// Start watcher
startWatcher();
