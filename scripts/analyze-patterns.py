#!/usr/bin/env python3
"""
Pattern Analysis Script
Analyzes decision outcomes to identify successful patterns and anti-patterns
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
        print(f"Warning: Could not load {filepath}: {e}")
        return {}

def analyze_patterns():
    """Analyze patterns from decision history"""
    decisions_dir = Path('.kiro/memory/decisions')
    patterns_dir = Path('.kiro/memory/patterns')
    successful_dir = patterns_dir / 'successful'
    anti_patterns_dir = patterns_dir / 'anti-patterns'
    experimental_dir = patterns_dir / 'experimental'
    
    # Create directories
    successful_dir.mkdir(parents=True, exist_ok=True)
    anti_patterns_dir.mkdir(parents=True, exist_ok=True)
    experimental_dir.mkdir(parents=True, exist_ok=True)
    
    print("Analyzing patterns from decision history...")
    
    # Find decision files
    decision_files = list(decisions_dir.glob('dec-*.json'))
    total_decisions = len(decision_files)
    
    if total_decisions < 10:
        print(f"⚠️  Not enough decisions yet (need 10, have {total_decisions})")
        print("Skipping pattern analysis")
        return
    
    print(f"Total decisions analyzed: {total_decisions}")
    
    # Track patterns
    pattern_success = defaultdict(int)
    pattern_total = defaultdict(int)
    
    # Parse decisions
    for decision_file in decision_files:
        decision = load_json(str(decision_file))
        if not decision:
            continue
        
        task_type = decision.get('taskType', 'unknown')
        success = decision.get('outcome', {}).get('success', False)
        
        pattern_total[task_type] += 1
        if success:
            pattern_success[task_type] += 1
    
    print("\nPattern Analysis Results:")
    print("=" * 50)
    
    # Analyze each pattern
    for pattern, total in pattern_total.items():
        success = pattern_success[pattern]
        success_rate = success / total if total > 0 else 0
        percentage = int(success_rate * 100)
        
        print(f"\nPattern: {pattern}")
        print(f"  Total: {total} decisions")
        print(f"  Successful: {success}")
        print(f"  Success rate: {percentage}%")
        
        # Categorize pattern
        if success_rate >= 0.90:
            category = "successful"
            category_label = "✅ SUCCESSFUL (≥90%)"
            output_dir = successful_dir
            
            recommendations = [
                f"Continue using this approach for {pattern} tasks",
                "Share this pattern with team",
                "Consider creating a skill or steering file for this pattern"
            ]
            
        elif success_rate < 0.70:
            category = "anti-patterns"
            category_label = "❌ ANTI-PATTERN (<70%)"
            output_dir = anti_patterns_dir
            
            recommendations = [
                f"Avoid this approach for {pattern} tasks",
                "Investigate why this pattern fails",
                "Identify alternative approaches",
                "Document lessons learned"
            ]
            
        else:
            category = "experimental"
            category_label = "🔬 EXPERIMENTAL (70-90%)"
            output_dir = experimental_dir
            
            recommendations = [
                "Continue tracking this pattern",
                "Gather more data before making conclusions",
                "Monitor for improvements or degradation",
                "Consider A/B testing variations"
            ]
        
        print(f"  Category: {category_label}")
        
        # Create pattern documentation
        doc_content = f"""# {category_label.split()[1]}: {pattern}

**Success Rate:** {percentage}%  
**Total Decisions:** {total}  
**Successful:** {success}  
**Category:** {category_label}

## Analysis

This pattern has demonstrated {"high" if success_rate >= 0.90 else "low" if success_rate < 0.70 else "moderate"} success rate and should be:
"""
        
        for rec in recommendations:
            doc_content += f"- {rec}\n"
        
        doc_content += f"""
## Recommendations

"""
        for i, rec in enumerate(recommendations, 1):
            doc_content += f"{i}. {rec}\n"
        
        doc_content += f"""
## Last Updated

{datetime.now().isoformat()}
"""
        
        # Save documentation
        doc_file = output_dir / f"{pattern}.md"
        with open(doc_file, 'w', encoding='utf-8') as f:
            f.write(doc_content)
        
        print(f"  Documentation: {category}/{pattern}.md")
    
    # Summary
    successful_count = len(list(successful_dir.glob('*.md')))
    anti_pattern_count = len(list(anti_patterns_dir.glob('*.md')))
    experimental_count = len(list(experimental_dir.glob('*.md')))
    
    print("\n✅ Pattern analysis complete")
    print("\nSummary:")
    print(f"  - Successful patterns: {successful_count}")
    print(f"  - Anti-patterns: {anti_pattern_count}")
    print(f"  - Experimental: {experimental_count}")

if __name__ == '__main__':
    analyze_patterns()
