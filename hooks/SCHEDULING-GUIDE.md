# Hook Scheduling Guide

**Version:** 1.0  
**Date:** 2026-03-03  
**Status:** Autonomous Implementation

---

## Overview

This guide explains how to schedule hooks for automatic execution without manual triggers.

---

## Scheduling Options

### Option 1: Windows Task Scheduler (Recommended for Windows)

**Daily Report (Every day at 6 PM):**
```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "kiro" -Argument "trigger-hook 'Daily Report Generation'"
$trigger = New-ScheduledTaskTrigger -Daily -At 6PM
Register-ScheduledTask -TaskName "Kiro-DailyReport" -Action $action -Trigger $trigger
```

**Weekly Report (Every Monday at 9 AM):**
```powershell
$action = New-ScheduledTaskAction -Execute "kiro" -Argument "trigger-hook 'Weekly Report Generation'"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9AM
Register-ScheduledTask -TaskName "Kiro-WeeklyReport" -Action $action -Trigger $trigger
```

**Weekly Weight Update (Every Monday at 9:30 AM):**
```powershell
$action = New-ScheduledTaskAction -Execute "kiro" -Argument "trigger-hook 'Weekly Agent Weight Update'"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9:30AM
Register-ScheduledTask -TaskName "Kiro-WeightUpdate" -Action $action -Trigger $trigger
```

### Option 2: Cron (Linux/Mac)

**Edit crontab:**
```bash
crontab -e
```

**Add schedules:**
```cron
# Daily report at 6 PM
0 18 * * * kiro trigger-hook "Daily Report Generation"

# Weekly report every Monday at 9 AM
0 9 * * 1 kiro trigger-hook "Weekly Report Generation"

# Weekly weight update every Monday at 9:30 AM
30 9 * * 1 kiro trigger-hook "Weekly Agent Weight Update"
```

### Option 3: Node.js Scheduler (Cross-platform)

**Create scheduler script:**
```javascript
// .kiro/scripts/scheduler.js
const schedule = require('node-schedule');
const { exec } = require('child_process');

// Daily report at 6 PM
schedule.scheduleJob('0 18 * * *', () => {
  exec('kiro trigger-hook "Daily Report Generation"');
});

// Weekly report every Monday at 9 AM
schedule.scheduleJob('0 9 * * 1', () => {
  exec('kiro trigger-hook "Weekly Report Generation"');
});

// Weekly weight update every Monday at 9:30 AM
schedule.scheduleJob('30 9 * * 1', () => {
  exec('kiro trigger-hook "Weekly Agent Weight Update"');
});

console.log('Kiro hook scheduler started');
```

**Run scheduler:**
```bash
node .kiro/scripts/scheduler.js
```

**Run as background service:**
```bash
# Using PM2
npm install -g pm2
pm2 start .kiro/scripts/scheduler.js --name kiro-scheduler
pm2 save
pm2 startup
```

---

## Recommended Schedule

| Hook | Frequency | Time | Reason |
|------|-----------|------|--------|
| Daily Report | Daily | 6 PM | End of workday summary |
| Weekly Report | Weekly (Monday) | 9 AM | Start of week review |
| Weight Update | Weekly (Monday) | 9:30 AM | After weekly report |

---

## Setup Instructions

### For Windows Users

1. Open PowerShell as Administrator
2. Run the PowerShell commands above
3. Verify tasks created:
   ```powershell
   Get-ScheduledTask | Where-Object {$_.TaskName -like "Kiro-*"}
   ```

### For Linux/Mac Users

1. Open terminal
2. Edit crontab: `crontab -e`
3. Add cron schedules
4. Save and exit
5. Verify: `crontab -l`

### For Cross-Platform (Node.js)

1. Install dependencies:
   ```bash
   npm install node-schedule
   ```
2. Create scheduler script (see above)
3. Install PM2:
   ```bash
   npm install -g pm2
   ```
4. Start scheduler:
   ```bash
   pm2 start .kiro/scripts/scheduler.js --name kiro-scheduler
   pm2 save
   pm2 startup
   ```

---

## Monitoring

### Check Scheduled Tasks (Windows)
```powershell
Get-ScheduledTask | Where-Object {$_.TaskName -like "Kiro-*"} | Get-ScheduledTaskInfo
```

### Check Cron Jobs (Linux/Mac)
```bash
crontab -l
```

### Check PM2 Status
```bash
pm2 status
pm2 logs kiro-scheduler
```

---

## Troubleshooting

### Hook Not Running

**Check:**
1. Scheduler is active
2. Kiro command in PATH
3. Hook name is correct
4. Permissions are correct

**Windows:**
```powershell
# Check task status
Get-ScheduledTask -TaskName "Kiro-DailyReport"

# Run manually to test
Start-ScheduledTask -TaskName "Kiro-DailyReport"
```

**Linux/Mac:**
```bash
# Check cron service
systemctl status cron

# Check cron logs
grep CRON /var/log/syslog
```

### Hook Fails Silently

**Add logging:**

**Windows Task Scheduler:**
- Add `-WorkingDirectory` parameter
- Enable task history
- Check Event Viewer

**Cron:**
```cron
# Redirect output to log
0 18 * * * kiro trigger-hook "Daily Report Generation" >> /var/log/kiro-hooks.log 2>&1
```

**PM2:**
```bash
# View logs
pm2 logs kiro-scheduler

# View error logs
pm2 logs kiro-scheduler --err
```

---

## Notifications

### Email Notifications (Optional)

**Add to hook:**
```json
{
  "then": {
    "type": "runCommand",
    "command": "kiro trigger-hook 'Daily Report Generation' && send-email report@example.com"
  }
}
```

### Slack Notifications (Optional)

**Add webhook:**
```bash
# After hook execution
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Daily report generated"}' \
  YOUR_SLACK_WEBHOOK_URL
```

---

## Best Practices

**Do:**
- ✅ Test hooks manually first
- ✅ Monitor execution logs
- ✅ Set up notifications for failures
- ✅ Use absolute paths in commands
- ✅ Document custom schedules

**Don't:**
- ❌ Schedule too frequently (causes load)
- ❌ Forget to test after setup
- ❌ Ignore failed executions
- ❌ Use relative paths

---

## Autonomous Setup Complete

**Status:** ✅ Scheduling guide created

**Next Steps:**
1. User can choose scheduling method
2. Follow setup instructions
3. Hooks will run automatically
4. No manual triggers needed

---

**Created By:** Dev Team Mode (Autonomous)  
**Date:** 2026-03-03  
**Version:** 1.0
