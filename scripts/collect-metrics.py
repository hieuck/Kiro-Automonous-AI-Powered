#!/usr/bin/env python3
"""
Metrics Collection Script
Collects daily metrics for AI team performance tracking
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

def load_decision(filepath: str) -> Dict[str, Any]:
    """Load a decision JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load {filepath}: {e}")
        return {}

def collect_metrics():
    """Collect metrics from decision files"""
    # Paths
    decisions_dir = Path('.kiro/memory/decisions')
    metrics_dir = Path('.kiro/memory/metrics')
    metrics_dir.mkdir(parents=True, exist_ok=True)
    
    # Date info
    today = datetime.now()
    date_str = today.strftime('%Y-%m-%d')
    month_str = today.strftime('%Y-%m')
    output_file = metrics_dir / f'{month_str}.json'
    
    print(f"Collecting metrics for {date_str}...")
    
    # Find all decision files
    decision_files = list(decisions_dir.glob('dec-*.json'))
    total_decisions = len(decision_files)
    
    print(f"Found {total_decisions} decision files")
    
    if total_decisions == 0:
        print("No decisions to analyze")
        return
    
    # Parse decisions
    successful = 0
    total_quality = 0.0
    total_consensus = 0.0
    total_cycle_time = 0
    count = 0
    
    for decision_file in decision_files:
        decision = load_decision(str(decision_file))
        if not decision:
            continue
        
        outcome = decision.get('outcome', {})
        consensus = decision.get('consensus', {})
        
        # Track metrics
        if outcome.get('success', False):
            successful += 1
        
        total_quality += outcome.get('qualityScore', 0)
        total_consensus += consensus.get('consensusScore', 0)
        total_cycle_time += outcome.get('executionTime', 0)
        count += 1
    
    # Calculate averages
    if count > 0:
        avg_quality = round(total_quality / count, 2)
        avg_consensus = round(total_consensus / count, 2)
        avg_cycle_time = int(total_cycle_time / count)
        success_rate = round(successful / count, 2)
    else:
        avg_quality = 0
        avg_consensus = 0
        avg_cycle_time = 0
        success_rate = 0
    
    # Create metrics data
    metrics = {
        "month": month_str,
        "lastUpdated": datetime.now().isoformat(),
        "dailyMetrics": {
            date_str: {
                "totalDecisions": count,
                "successfulDecisions": successful,
                "successRate": success_rate,
                "averageQualityScore": avg_quality,
                "averageConsensus": avg_consensus,
                "averageCycleTime": avg_cycle_time
            }
        },
        "summary": {
            "totalDecisions": total_decisions,
            "successfulDecisions": successful,
            "successRate": success_rate,
            "averageQualityScore": avg_quality,
            "averageConsensus": avg_consensus,
            "averageCycleTime": avg_cycle_time
        }
    }
    
    # Save metrics
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\nMetrics saved to: {output_file}")
    print(f"  - Total decisions: {count}")
    print(f"  - Successful: {successful}")
    print(f"  - Success rate: {success_rate}")
    print(f"  - Avg quality: {avg_quality}")
    print(f"  - Avg consensus: {avg_consensus}")
    print(f"  - Avg cycle time: {avg_cycle_time}ms")
    print("\n✅ Metrics collection complete")

if __name__ == '__main__':
    collect_metrics()
