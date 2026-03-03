# Service Watcher Guide
**Auto Lint Fix & Build on Service Changes**

---

## 🎯 What It Does

Service Watcher automatically runs when you save service files:

1. **Auto-fix ESLint issues** - Fixes formatting and lint errors
2. **Build TypeScript** - Compiles to JavaScript
3. **Run related tests** - Tests affected services

All in **background** without blocking your workflow!

---

## 🚀 Quick Start

### Linux/Mac

```bash
# Start watcher
bash .kiro/scripts/manage-watchers.sh start service

# View logs
bash .kiro/scripts/manage-watchers.sh logs service

# Stop watcher
bash .kiro/scripts/manage-watchers.sh stop service
```

### Windows

```powershell
# Start watcher
.\.kiro\scripts\manage-watchers.ps1 start service

# View logs
.\.kiro\scripts\manage-watchers.ps1 logs service

# Stop watcher
.\.kiro\scripts\manage-watchers.ps1 stop service
```

---

## 📁 What Files Are Watched

```
muh5/packages/server/src/
├── services/**/*.ts       ✅ Watched
├── types/**/*.ts          ✅ Watched
├── repositories/**/*.ts   ✅ Watched
└── __tests__/**/*.ts      ❌ Ignored
```

**Ignored:**
- Test files (`*.test.ts`, `*.property.ts`)
- Node modules
- Build output (`dist/`)
- Coverage reports

---

## 🔄 Workflow Example

### 1. Start Watcher

```bash
bash .kiro/scripts/manage-watchers.sh start service
```

Output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Service Watcher Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Watching:
   - muh5/packages/server/src/services/**/*.ts
   - muh5/packages/server/src/types/**/*.ts
   - muh5/packages/server/src/repositories/**/*.ts

Actions on change:
   1. Auto-fix ESLint issues
   2. Build TypeScript
   3. Run related tests

Press Ctrl+C to stop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Watcher ready, monitoring for changes...
```

### 2. Edit Service File

Save `muh5/packages/server/src/services/item-validator.service.ts`

### 3. Automatic Processing

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Processing 1 changed file(s)
   - muh5/packages/server/src/services/item-validator.service.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Step 1/3: Auto-fixing lint issues...
✅ ESLint auto-fix completed

🔨 Step 2/3: Building TypeScript...
✅ TypeScript build completed

🧪 Step 3/3: Running tests...
✅ Running tests completed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All steps completed in 3.45s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Continue Working

Watcher keeps running, monitoring for more changes!

---

## 🎛️ Management Commands

### Start/Stop

```bash
# Start service watcher
bash .kiro/scripts/manage-watchers.sh start service

# Stop service watcher
bash .kiro/scripts/manage-watchers.sh stop service

# Restart service watcher
bash .kiro/scripts/manage-watchers.sh restart service
```

### Status

```bash
bash .kiro/scripts/manage-watchers.sh status
```

Output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Watcher Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Service Watcher: Running (PID: 12345)
❌ Quality Watcher: Stopped
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### View Logs

```bash
# Real-time logs
bash .kiro/scripts/manage-watchers.sh logs service

# Or manually
tail -f .kiro/logs/service-watcher.log
```

---

## ⚙️ Configuration

Edit `.kiro/scripts/service-watcher.js`:

```javascript
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
```

### Adjust Debounce Delay

```javascript
debounceDelay: 2000, // Wait 2s instead of 1s
```

### Add More Watch Paths

```javascript
watchPaths: [
  'muh5/packages/server/src/services/**/*.ts',
  'muh5/packages/server/src/middleware/**/*.ts', // Add this
],
```

---

## 🔍 Troubleshooting

### Watcher Not Starting

**Check Node.js:**
```bash
node --version  # Should be >= 18
```

**Check Dependencies:**
```bash
cd muh5
npm install
```

**Check Logs:**
```bash
cat .kiro/logs/service-watcher.log
```

### Watcher Not Detecting Changes

**Check File Path:**
- Ensure file matches watch patterns
- Check if file is in ignored paths

**Restart Watcher:**
```bash
bash .kiro/scripts/manage-watchers.sh restart service
```

### Build Fails

**Check TypeScript Errors:**
```bash
cd muh5
npm run type-check
```

**Fix Errors Manually:**
- Watcher will continue after errors
- Fix issues and save again

### Tests Fail

**Run Tests Manually:**
```bash
cd muh5
npm test
```

**Watcher Continues:**
- Test failures don't stop watcher
- Fix tests and save again

---

## 📊 Performance

### Resource Usage

- **CPU:** Low (idle when no changes)
- **Memory:** ~50-100MB
- **Disk I/O:** Minimal (only on file changes)

### Processing Time

Typical processing time per change:
- ESLint fix: 0.5-1s
- TypeScript build: 2-5s
- Tests: 1-3s
- **Total:** 3-9s

### Debouncing

Watcher waits 1s after last change before processing:
- Save file → Wait 1s → Process
- Save again within 1s → Reset timer
- Prevents multiple builds for rapid saves

---

## 🎯 Best Practices

### 1. Start Watcher at Beginning of Session

```bash
# Add to your startup script
bash .kiro/scripts/manage-watchers.sh start service
```

### 2. Stop Watcher When Not Needed

```bash
# Before long break or end of day
bash .kiro/scripts/manage-watchers.sh stop service
```

### 3. Monitor Logs Occasionally

```bash
# Check for errors
tail -n 50 .kiro/logs/service-watcher.log
```

### 4. Restart After Config Changes

```bash
# After editing watcher config
bash .kiro/scripts/manage-watchers.sh restart service
```

### 5. Use with Quality Watcher

```bash
# Start both watchers
bash .kiro/scripts/manage-watchers.sh start
```

---

## 🆚 Comparison with Manual Workflow

### Manual Workflow

```bash
# Edit file
vim service.ts

# Lint
npm run lint -- service.ts --fix

# Build
npm run build:server

# Test
npm test -- service

# Total: ~30 seconds + manual commands
```

### With Service Watcher

```bash
# Edit file
vim service.ts

# Save → Automatic!
# Total: ~5 seconds, no manual commands
```

**Time Saved:** ~25 seconds per change  
**Efficiency:** 6x faster

---

## 🔗 Integration with Hooks

Service Watcher works alongside Kiro hooks:

### Post-Implementation Hook
- Runs after task completion
- Background quality check
- Generates report

### Service Watcher
- Runs on every file save
- Real-time feedback
- Continuous monitoring

**Use Both:**
- Watcher: During active development
- Hook: After completing tasks

---

## 📚 Related Files

- `.kiro/scripts/service-watcher.js` - Main watcher script
- `.kiro/scripts/manage-watchers.sh` - Management script (Linux/Mac)
- `.kiro/scripts/manage-watchers.ps1` - Management script (Windows)
- `.kiro/logs/service-watcher.log` - Watcher logs
- `.kiro/.service-watcher.pid` - Process ID file

---

## 🎉 Summary

**Service Watcher = Auto Lint Fix + Build + Test on Save**

✅ Saves time (6x faster)  
✅ Runs in background  
✅ No manual commands  
✅ Real-time feedback  
✅ Continuous monitoring

**Start it once, forget about it!**

---

**Last Updated:** 2026-03-03  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
