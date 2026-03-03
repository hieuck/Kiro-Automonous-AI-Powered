#!/bin/bash
# Manage background watchers

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PID_DIR="$PROJECT_ROOT/.kiro"
LOG_DIR="$PROJECT_ROOT/.kiro/logs"

# Ensure directories exist
mkdir -p "$PID_DIR"
mkdir -p "$LOG_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if process is running
is_running() {
  local pid_file=$1
  if [ -f "$pid_file" ]; then
    local pid=$(cat "$pid_file")
    if ps -p "$pid" > /dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

# Function to start service watcher
start_service_watcher() {
  local pid_file="$PID_DIR/.service-watcher.pid"
  
  if is_running "$pid_file"; then
    echo -e "${YELLOW}⚠️  Service watcher already running (PID: $(cat $pid_file))${NC}"
    return 1
  fi
  
  echo -e "${BLUE}🚀 Starting service watcher...${NC}"
  node "$SCRIPT_DIR/service-watcher.js" > "$LOG_DIR/service-watcher.log" 2>&1 &
  echo $! > "$pid_file"
  
  sleep 1
  
  if is_running "$pid_file"; then
    echo -e "${GREEN}✅ Service watcher started (PID: $(cat $pid_file))${NC}"
    echo -e "${BLUE}📄 Logs: tail -f $LOG_DIR/service-watcher.log${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to start service watcher${NC}"
    rm -f "$pid_file"
    return 1
  fi
}

# Function to stop service watcher
stop_service_watcher() {
  local pid_file="$PID_DIR/.service-watcher.pid"
  
  if ! is_running "$pid_file"; then
    echo -e "${YELLOW}⚠️  Service watcher not running${NC}"
    rm -f "$pid_file"
    return 1
  fi
  
  local pid=$(cat "$pid_file")
  echo -e "${BLUE}🛑 Stopping service watcher (PID: $pid)...${NC}"
  kill "$pid"
  
  sleep 1
  
  if ! is_running "$pid_file"; then
    echo -e "${GREEN}✅ Service watcher stopped${NC}"
    rm -f "$pid_file"
    return 0
  else
    echo -e "${RED}❌ Failed to stop service watcher, force killing...${NC}"
    kill -9 "$pid"
    rm -f "$pid_file"
    return 1
  fi
}

# Function to start quality watcher
start_quality_watcher() {
  local pid_file="$PID_DIR/.quality-watcher.pid"
  
  if is_running "$pid_file"; then
    echo -e "${YELLOW}⚠️  Quality watcher already running (PID: $(cat $pid_file))${NC}"
    return 1
  fi
  
  echo -e "${BLUE}🚀 Starting quality watcher...${NC}"
  node "$SCRIPT_DIR/quality-watcher.js" > "$LOG_DIR/quality-watcher.log" 2>&1 &
  echo $! > "$pid_file"
  
  sleep 1
  
  if is_running "$pid_file"; then
    echo -e "${GREEN}✅ Quality watcher started (PID: $(cat $pid_file))${NC}"
    echo -e "${BLUE}📄 Logs: tail -f $LOG_DIR/quality-watcher.log${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to start quality watcher${NC}"
    rm -f "$pid_file"
    return 1
  fi
}

# Function to stop quality watcher
stop_quality_watcher() {
  local pid_file="$PID_DIR/.quality-watcher.pid"
  
  if ! is_running "$pid_file"; then
    echo -e "${YELLOW}⚠️  Quality watcher not running${NC}"
    rm -f "$pid_file"
    return 1
  fi
  
  local pid=$(cat "$pid_file")
  echo -e "${BLUE}🛑 Stopping quality watcher (PID: $pid)...${NC}"
  kill "$pid"
  
  sleep 1
  
  if ! is_running "$pid_file"; then
    echo -e "${GREEN}✅ Quality watcher stopped${NC}"
    rm -f "$pid_file"
    return 0
  else
    echo -e "${RED}❌ Failed to stop quality watcher, force killing...${NC}"
    kill -9 "$pid"
    rm -f "$pid_file"
    return 1
  fi
}

# Function to show status
show_status() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}📊 Watcher Status${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  # Service watcher
  local service_pid_file="$PID_DIR/.service-watcher.pid"
  if is_running "$service_pid_file"; then
    echo -e "${GREEN}✅ Service Watcher: Running (PID: $(cat $service_pid_file))${NC}"
  else
    echo -e "${RED}❌ Service Watcher: Stopped${NC}"
  fi
  
  # Quality watcher
  local quality_pid_file="$PID_DIR/.quality-watcher.pid"
  if is_running "$quality_pid_file"; then
    echo -e "${GREEN}✅ Quality Watcher: Running (PID: $(cat $quality_pid_file))${NC}"
  else
    echo -e "${RED}❌ Quality Watcher: Stopped${NC}"
  fi
  
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to start all watchers
start_all() {
  echo -e "${BLUE}🚀 Starting all watchers...${NC}"
  start_service_watcher
  start_quality_watcher
  echo ""
  show_status
}

# Function to stop all watchers
stop_all() {
  echo -e "${BLUE}🛑 Stopping all watchers...${NC}"
  stop_service_watcher
  stop_quality_watcher
  echo ""
  show_status
}

# Function to restart all watchers
restart_all() {
  echo -e "${BLUE}🔄 Restarting all watchers...${NC}"
  stop_all
  sleep 2
  start_all
}

# Function to show logs
show_logs() {
  local watcher=$1
  
  if [ "$watcher" = "service" ]; then
    tail -f "$LOG_DIR/service-watcher.log"
  elif [ "$watcher" = "quality" ]; then
    tail -f "$LOG_DIR/quality-watcher.log"
  else
    echo -e "${RED}❌ Unknown watcher: $watcher${NC}"
    echo "Usage: $0 logs [service|quality]"
    return 1
  fi
}

# Main command handler
case "$1" in
  start)
    if [ -z "$2" ]; then
      start_all
    elif [ "$2" = "service" ]; then
      start_service_watcher
    elif [ "$2" = "quality" ]; then
      start_quality_watcher
    else
      echo -e "${RED}❌ Unknown watcher: $2${NC}"
      echo "Usage: $0 start [service|quality]"
      exit 1
    fi
    ;;
  stop)
    if [ -z "$2" ]; then
      stop_all
    elif [ "$2" = "service" ]; then
      stop_service_watcher
    elif [ "$2" = "quality" ]; then
      stop_quality_watcher
    else
      echo -e "${RED}❌ Unknown watcher: $2${NC}"
      echo "Usage: $0 stop [service|quality]"
      exit 1
    fi
    ;;
  restart)
    if [ -z "$2" ]; then
      restart_all
    elif [ "$2" = "service" ]; then
      stop_service_watcher
      sleep 1
      start_service_watcher
    elif [ "$2" = "quality" ]; then
      stop_quality_watcher
      sleep 1
      start_quality_watcher
    else
      echo -e "${RED}❌ Unknown watcher: $2${NC}"
      echo "Usage: $0 restart [service|quality]"
      exit 1
    fi
    ;;
  status)
    show_status
    ;;
  logs)
    show_logs "$2"
    ;;
  *)
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔧 Watcher Management${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|logs} [service|quality]"
    echo ""
    echo "Commands:"
    echo "  start [watcher]    - Start watcher(s)"
    echo "  stop [watcher]     - Stop watcher(s)"
    echo "  restart [watcher]  - Restart watcher(s)"
    echo "  status             - Show watcher status"
    echo "  logs [watcher]     - Show watcher logs"
    echo ""
    echo "Watchers:"
    echo "  service            - Auto lint-fix & build on service changes"
    echo "  quality            - Continuous quality checks"
    echo ""
    echo "Examples:"
    echo "  $0 start           - Start all watchers"
    echo "  $0 start service   - Start service watcher only"
    echo "  $0 stop            - Stop all watchers"
    echo "  $0 status          - Show status"
    echo "  $0 logs service    - Show service watcher logs"
    echo ""
    exit 1
    ;;
esac
