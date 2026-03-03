# Manage background watchers (PowerShell version)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$PidDir = Join-Path $ProjectRoot ".kiro"
$LogDir = Join-Path $ProjectRoot ".kiro\logs"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $PidDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# Function to check if process is running
function Test-ProcessRunning {
    param($PidFile)
    
    if (Test-Path $PidFile) {
        $pid = Get-Content $PidFile
        try {
            $process = Get-Process -Id $pid -ErrorAction Stop
            return $true
        } catch {
            return $false
        }
    }
    return $false
}

# Function to start service watcher
function Start-ServiceWatcher {
    $pidFile = Join-Path $PidDir ".service-watcher.pid"
    
    if (Test-ProcessRunning $pidFile) {
        $pid = Get-Content $pidFile
        Write-Host "⚠️  Service watcher already running (PID: $pid)" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🚀 Starting service watcher..." -ForegroundColor Blue
    
    $logFile = Join-Path $LogDir "service-watcher.log"
    $scriptPath = Join-Path $ScriptDir "service-watcher.js"
    
    $process = Start-Process -FilePath "node" -ArgumentList $scriptPath `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError $logFile `
        -WindowStyle Hidden `
        -PassThru
    
    $process.Id | Out-File $pidFile
    
    Start-Sleep -Seconds 1
    
    if (Test-ProcessRunning $pidFile) {
        Write-Host "✅ Service watcher started (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📄 Logs: Get-Content $logFile -Wait" -ForegroundColor Blue
    } else {
        Write-Host "❌ Failed to start service watcher" -ForegroundColor Red
        Remove-Item $pidFile -ErrorAction SilentlyContinue
    }
}

# Function to stop service watcher
function Stop-ServiceWatcher {
    $pidFile = Join-Path $PidDir ".service-watcher.pid"
    
    if (-not (Test-ProcessRunning $pidFile)) {
        Write-Host "⚠️  Service watcher not running" -ForegroundColor Yellow
        Remove-Item $pidFile -ErrorAction SilentlyContinue
        return
    }
    
    $pid = Get-Content $pidFile
    Write-Host "🛑 Stopping service watcher (PID: $pid)..." -ForegroundColor Blue
    
    try {
        Stop-Process -Id $pid -Force
        Start-Sleep -Seconds 1
        
        if (-not (Test-ProcessRunning $pidFile)) {
            Write-Host "✅ Service watcher stopped" -ForegroundColor Green
            Remove-Item $pidFile
        } else {
            Write-Host "❌ Failed to stop service watcher" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error stopping service watcher: $_" -ForegroundColor Red
    }
}

# Function to start quality watcher
function Start-QualityWatcher {
    $pidFile = Join-Path $PidDir ".quality-watcher.pid"
    
    if (Test-ProcessRunning $pidFile) {
        $pid = Get-Content $pidFile
        Write-Host "⚠️  Quality watcher already running (PID: $pid)" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🚀 Starting quality watcher..." -ForegroundColor Blue
    
    $logFile = Join-Path $LogDir "quality-watcher.log"
    $scriptPath = Join-Path $ScriptDir "quality-watcher.js"
    
    $process = Start-Process -FilePath "node" -ArgumentList $scriptPath `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError $logFile `
        -WindowStyle Hidden `
        -PassThru
    
    $process.Id | Out-File $pidFile
    
    Start-Sleep -Seconds 1
    
    if (Test-ProcessRunning $pidFile) {
        Write-Host "✅ Quality watcher started (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📄 Logs: Get-Content $logFile -Wait" -ForegroundColor Blue
    } else {
        Write-Host "❌ Failed to start quality watcher" -ForegroundColor Red
        Remove-Item $pidFile -ErrorAction SilentlyContinue
    }
}

# Function to stop quality watcher
function Stop-QualityWatcher {
    $pidFile = Join-Path $PidDir ".quality-watcher.pid"
    
    if (-not (Test-ProcessRunning $pidFile)) {
        Write-Host "⚠️  Quality watcher not running" -ForegroundColor Yellow
        Remove-Item $pidFile -ErrorAction SilentlyContinue
        return
    }
    
    $pid = Get-Content $pidFile
    Write-Host "🛑 Stopping quality watcher (PID: $pid)..." -ForegroundColor Blue
    
    try {
        Stop-Process -Id $pid -Force
        Start-Sleep -Seconds 1
        
        if (-not (Test-ProcessRunning $pidFile)) {
            Write-Host "✅ Quality watcher stopped" -ForegroundColor Green
            Remove-Item $pidFile
        } else {
            Write-Host "❌ Failed to stop quality watcher" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error stopping quality watcher: $_" -ForegroundColor Red
    }
}

# Function to show status
function Show-Status {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "📊 Watcher Status" -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    
    # Service watcher
    $servicePidFile = Join-Path $PidDir ".service-watcher.pid"
    if (Test-ProcessRunning $servicePidFile) {
        $pid = Get-Content $servicePidFile
        Write-Host "✅ Service Watcher: Running (PID: $pid)" -ForegroundColor Green
    } else {
        Write-Host "❌ Service Watcher: Stopped" -ForegroundColor Red
    }
    
    # Quality watcher
    $qualityPidFile = Join-Path $PidDir ".quality-watcher.pid"
    if (Test-ProcessRunning $qualityPidFile) {
        $pid = Get-Content $qualityPidFile
        Write-Host "✅ Quality Watcher: Running (PID: $pid)" -ForegroundColor Green
    } else {
        Write-Host "❌ Quality Watcher: Stopped" -ForegroundColor Red
    }
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
}

# Main command handler
param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Watcher
)

switch ($Command) {
    "start" {
        if ([string]::IsNullOrEmpty($Watcher)) {
            Start-ServiceWatcher
            Start-QualityWatcher
            Write-Host ""
            Show-Status
        } elseif ($Watcher -eq "service") {
            Start-ServiceWatcher
        } elseif ($Watcher -eq "quality") {
            Start-QualityWatcher
        } else {
            Write-Host "❌ Unknown watcher: $Watcher" -ForegroundColor Red
            Write-Host "Usage: .\manage-watchers.ps1 start [service|quality]"
        }
    }
    "stop" {
        if ([string]::IsNullOrEmpty($Watcher)) {
            Stop-ServiceWatcher
            Stop-QualityWatcher
            Write-Host ""
            Show-Status
        } elseif ($Watcher -eq "service") {
            Stop-ServiceWatcher
        } elseif ($Watcher -eq "quality") {
            Stop-QualityWatcher
        } else {
            Write-Host "❌ Unknown watcher: $Watcher" -ForegroundColor Red
            Write-Host "Usage: .\manage-watchers.ps1 stop [service|quality]"
        }
    }
    "restart" {
        if ([string]::IsNullOrEmpty($Watcher)) {
            Stop-ServiceWatcher
            Stop-QualityWatcher
            Start-Sleep -Seconds 2
            Start-ServiceWatcher
            Start-QualityWatcher
            Write-Host ""
            Show-Status
        } elseif ($Watcher -eq "service") {
            Stop-ServiceWatcher
            Start-Sleep -Seconds 1
            Start-ServiceWatcher
        } elseif ($Watcher -eq "quality") {
            Stop-QualityWatcher
            Start-Sleep -Seconds 1
            Start-QualityWatcher
        } else {
            Write-Host "❌ Unknown watcher: $Watcher" -ForegroundColor Red
            Write-Host "Usage: .\manage-watchers.ps1 restart [service|quality]"
        }
    }
    "status" {
        Show-Status
    }
    "logs" {
        if ($Watcher -eq "service") {
            $logFile = Join-Path $LogDir "service-watcher.log"
            Get-Content $logFile -Wait
        } elseif ($Watcher -eq "quality") {
            $logFile = Join-Path $LogDir "quality-watcher.log"
            Get-Content $logFile -Wait
        } else {
            Write-Host "❌ Unknown watcher: $Watcher" -ForegroundColor Red
            Write-Host "Usage: .\manage-watchers.ps1 logs [service|quality]"
        }
    }
    default {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
        Write-Host "🔧 Watcher Management" -ForegroundColor Blue
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Usage: .\manage-watchers.ps1 {start|stop|restart|status|logs} [service|quality]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  start [watcher]    - Start watcher(s)"
        Write-Host "  stop [watcher]     - Stop watcher(s)"
        Write-Host "  restart [watcher]  - Restart watcher(s)"
        Write-Host "  status             - Show watcher status"
        Write-Host "  logs [watcher]     - Show watcher logs"
        Write-Host ""
        Write-Host "Watchers:"
        Write-Host "  service            - Auto lint-fix & build on service changes"
        Write-Host "  quality            - Continuous quality checks"
        Write-Host ""
        Write-Host "Examples:"
        Write-Host "  .\manage-watchers.ps1 start           - Start all watchers"
        Write-Host "  .\manage-watchers.ps1 start service   - Start service watcher only"
        Write-Host "  .\manage-watchers.ps1 stop            - Stop all watchers"
        Write-Host "  .\manage-watchers.ps1 status          - Show status"
        Write-Host "  .\manage-watchers.ps1 logs service    - Show service watcher logs"
        Write-Host ""
    }
}
