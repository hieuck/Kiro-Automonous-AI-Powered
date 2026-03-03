# Background Hooks Guide
**Date:** 2026-03-03  
**Purpose:** Run quality checks in background without blocking workflow

---

## ⚠️ Limitation

Kiro hooks **cannot run truly in background** because they are synchronous and part of the agent workflow. However, we can simulate background execution using these approaches:

---

## 🔧 Solution 1: Async Command Hook (Recommended)

### Setup

Hook đã được tạo: `background-quality-check`

**Trigger:** After task execution  
**Action:** Run background script with `&` (detach process)

### Usage

Hook tự động chạy sau mỗi task. Để xem kết quả:

```bash
# View logs
cat .kiro/logs/quality-check.log

# View latest report
ls -lt .kiro/reports/quality-check-*.md | head -1
```

### How It Works

1. Task completes
2. Hook triggers: `node .kiro/scripts/background-quality-check.js &`
3. Script runs in background (detached)
4. Agent continues without waiting
5. Results logged to `.kiro/logs/quality-check.log`
6. Report generated in `.kiro/reports/`

---

## 🔧 Solution 2: Continuous Watcher (True Background)

### Setup

Start watcher manually (runs continuously):

```bash
# Start watcher in background
node .kiro/scripts/quality-watcher.js &

# Or use npm script (if added)
npm run watch:quality &
```

### How It Works

1. Watcher monitors file changes
2. Debounces changes (waits 2s after last change)
3. Runs quality checks automatically
4. Logs results to `.kiro/logs/quality-watcher.log`

### Stop Watcher

```bash
# Find process
ps aux | grep quality-watcher

# Kill process
kill <PID>
```

---

## 🔧 Solution 3: Scheduled Checks (Cron-like)

### Setup

Add to crontab (Linux/Mac):

```bash
# Run quality check every hour
0 * * * * cd /path/to/project && node .kiro/scripts/background-quality-check.js

# Run quality check every 30 minutes
*/30 * * * * cd /path/to/project && node .kiro/scripts/background-quality-check.js
```

### Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily/Hourly
4. Action: Start Program
5. Program: `node`
6. Arguments: `.kiro/scripts/background-quality-check.js`
7. Start in: Project directory

---

## 📊 What Gets Checked

### Background Quality Check Script

1. **Linting**
   - Runs ESLint on changed files
   - Reports issues found

2. **Tests**
   - Runs all tests
   - Reports pass/fail

3. **Coverage**
   - Checks test coverage
   - Ensures >= 80% threshold

### Quality Watcher

1. **ESLint**
   - Auto-fixes issues
   - Runs on file save

2. **TypeScript**
   - Type checking
   - Reports errors

---

## 📁 Output Files

### Logs
```
.kiro/logs/
├── quality-check.log      # Background check logs
└── quality-watcher.log    # Watcher logs
```

### Reports
```
.kiro/reports/
├── quality-check-2026-03-03.md
├── quality-check-2026-03-04.md
└── ...
```

---

## 🎯 Comparison

| Approach | Pros | Cons | Use Case |
|----------|------|------|----------|
| **Async Hook** | ✅ Automatic<br>✅ No setup<br>✅ Non-blocking | ⚠️ Runs after task only | Post-implementation checks |
| **Watcher** | ✅ Continuous<br>✅ Real-time<br>✅ Auto-fix | ⚠️ Manual start<br>⚠️ Resource usage | Active development |
| **Scheduled** | ✅ Periodic<br>✅ Predictable | ⚠️ Not immediate<br>⚠️ Setup required | Regular audits |

---

## 🚀 Recommended Workflow

### During Development
```bash
# Start watcher for real-time checks
node .kiro/scripts/quality-watcher.js &
```

### After Implementation
- Hook automatically runs background check
- Review report in `.kiro/reports/`

### Periodic Audits
- Set up cron/scheduled task
- Run comprehensive checks hourly/daily

---

## 🔍 Monitoring

### Check if Background Process Running

```bash
# Linux/Mac
ps aux | grep quality

# Windows
tasklist | findstr node
```

### View Real-time Logs

```bash
# Background check
tail -f .kiro/logs/quality-check.log

# Watcher
tail -f .kiro/logs/quality-watcher.log
```

---

## 🛠️ Customization

### Modify Check Frequency

Edit `.kiro/scripts/quality-watcher.js`:

```javascript
const CONFIG = {
  debounceDelay: 2000, // Change to 5000 for 5s delay
  // ...
};
```

### Add Custom Checks

Edit `.kiro/scripts/background-quality-check.js`:

```javascript
function runCustomCheck() {
  log('Running custom check...');
  // Your custom logic here
}

// Add to main()
const results = {
  // ...
  custom: runCustomCheck(),
};
```

---

## ⚠️ Important Notes

1. **Background hooks are NOT truly async** - They detach the process but Kiro doesn't wait for results
2. **Check logs manually** - Results won't appear in agent output
3. **Resource usage** - Watcher consumes resources continuously
4. **Windows compatibility** - Use `start /b` instead of `&` for Windows

---

## 🎯 Best Practices

1. **Use async hook for post-implementation** - Automatic, no setup
2. **Use watcher during active development** - Real-time feedback
3. **Use scheduled checks for audits** - Periodic comprehensive checks
4. **Monitor logs regularly** - Don't let issues accumulate
5. **Stop watcher when not needed** - Save resources

---

## 📚 Related Files

- `.kiro/hooks/background-quality-check.kiro.hook` - Hook configuration
- `.kiro/scripts/background-quality-check.js` - Background check script
- `.kiro/scripts/quality-watcher.js` - Continuous watcher
- `.kiro/logs/` - Log files
- `.kiro/reports/` - Quality reports

---

**Last Updated:** 2026-03-03  
**Status:** ✅ Active
