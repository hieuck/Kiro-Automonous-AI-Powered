#!/usr/bin/env python3
"""
Agent Weight Update Script
Updates agent weights based on decision accuracy
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
from collections import defaultdict

def load_json(filepath: str) -> Dict[str, Any]:
    """Load a JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return {}

def save_json(filepath: str, data: Dict[str, Any]):
    """Save data to JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def update_weights():
    """Update agent weights based on decision accuracy"""
    weights_file = Path('.kiro/memory/agent-weights.json')
    decisions_dir = Path('.kiro/memory/decisions')
    
    print("Updating agent weights based on decision accuracy...")
    
    # Load weights
    if not weights_file.exists():
        print(f"❌ Error: Agent weights file not found at {weights_file}")
        return
    
    weights_data = load_json(str(weights_file))
    
    # Backup weights
    backup_file = weights_file.with_suffix('.json.backup')
    save_json(str(backup_file), weights_data)
    
    # Count decisions
    decision_files = list(decisions_dir.glob('dec-*.json'))
    total_decisions = len(decision_files)
    
    print(f"Total decisions tracked: {total_decisions}")
    
    # Check minimum threshold
    min_decisions = weights_data.get('adjustmentRules', {}).get('minDecisionsBeforeAdjustment', 20)
    if total_decisions < min_decisions:
        print(f"⚠️  Not enough decisions yet (need {min_decisions}, have {total_decisions})")
        print("Skipping weight adjustment")
        return
    
    print("✅ Sufficient decisions for weight adjustment")
    
    # Track agent performance
    agent_correct = defaultdict(int)
    agent_total = defaultdict(int)
    
    # Parse decisions
    for decision_file in decision_files:
        decision = load_json(str(decision_file))
        if not decision:
            continue
        
        success = decision.get('outcome', {}).get('success', False)
        agent_responses = decision.get('agentResponses', [])
        
        for response in agent_responses:
            agent = response.get('agent')
            agent_decision = response.get('decision')
            
            if not agent:
                continue
            
            agent_total[agent] += 1
            
            # If outcome was successful and agent approved, count as correct
            if success and agent_decision == 'Approve':
                agent_correct[agent] += 1
            # If outcome was failure and agent rejected, also count as correct
            elif not success and agent_decision == 'Reject':
                agent_correct[agent] += 1
    
    # Calculate team average
    team_total = sum(agent_total.values())
    team_correct = sum(agent_correct.values())
    
    if team_total == 0:
        print("⚠️  No decision data found")
        return
    
    team_avg = team_correct / team_total
    print(f"Team average accuracy: {team_avg:.4f}")
    
    # Adjustment rules
    adjustment_factor = weights_data.get('adjustmentRules', {}).get('adjustmentFactor', 0.05)
    max_multiplier = weights_data.get('adjustmentRules', {}).get('maxWeightMultiplier', 2.0)
    min_multiplier = weights_data.get('adjustmentRules', {}).get('minWeightMultiplier', 0.5)
    
    # Update weights for each agent
    timestamp = datetime.now().isoformat()
    
    for agent, total in agent_total.items():
        if total == 0:
            continue
        
        # Calculate accuracy
        correct = agent_correct[agent]
        accuracy = correct / total
        
        # Get current weight
        agent_data = weights_data['weights'].get(agent, {})
        current_weight = agent_data.get('current', 1.5)
        base_weight = agent_data.get('base', 1.5)
        
        # Calculate adjustment
        accuracy_diff = accuracy - team_avg
        adjustment = accuracy_diff * adjustment_factor
        new_weight = current_weight * (1 + adjustment)
        
        # Clamp between min and max
        min_weight = base_weight * min_multiplier
        max_weight = base_weight * max_multiplier
        new_weight = max(min_weight, min(max_weight, new_weight))
        
        # Update weights data
        if agent not in weights_data['weights']:
            weights_data['weights'][agent] = {
                'current': base_weight,
                'base': base_weight,
                'accuracy': None,
                'decisionsTracked': 0,
                'lastAdjusted': None,
                'adjustmentHistory': []
            }
        
        weights_data['weights'][agent]['current'] = round(new_weight, 4)
        weights_data['weights'][agent]['accuracy'] = round(accuracy, 4)
        weights_data['weights'][agent]['decisionsTracked'] = total
        weights_data['weights'][agent]['lastAdjusted'] = timestamp
        weights_data['weights'][agent]['adjustmentHistory'].append({
            'date': timestamp,
            'oldWeight': round(current_weight, 4),
            'newWeight': round(new_weight, 4),
            'accuracy': round(accuracy, 4)
        })
        
        print(f"  {agent}: accuracy={accuracy:.4f}, weight: {current_weight:.4f} → {new_weight:.4f}")
    
    # Update team metrics
    weights_data['teamMetrics']['averageAccuracy'] = round(team_avg, 4)
    weights_data['teamMetrics']['totalDecisions'] = team_total
    weights_data['teamMetrics']['successfulDecisions'] = team_correct
    weights_data['lastUpdated'] = timestamp
    
    # Save updated weights
    save_json(str(weights_file), weights_data)
    
    print("\n✅ Agent weights updated successfully")

if __name__ == '__main__':
    update_weights()
