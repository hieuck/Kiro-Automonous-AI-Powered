# Decision Logging System

## Purpose

This directory stores all significant decisions made by the AI team for learning and improvement purposes.

## Schema

Each decision is logged as a JSON file with the following structure:

```json
{
  "id": "dec-YYYY-MM-DD-NNN",
  "timestamp": "ISO 8601 timestamp",
  "taskType": "architecture|implementation|refactoring|bug-fix|feature",
  "taskContext": "Brief description of the task",
  "complexity": 1-10,
  "risk": "low|medium|high|critical",
  
  "agentResponses": [
    {
      "agent": "tech-lead|qa-lead|developer|devops-lead|product-owner",
      "decision": "Approve|Reject|Modify",
      "confidence": 0-100,
      "rationale": "Explanation of decision",
      "responseTime": "milliseconds"
    }
  ],
  
  "consensus": {
    "weightedApproval": 0-1,
    "avgConfidence": 0-100,
    "consensusScore": 0-1,
    "finalDecision": "Proceed|Escalate|Reject"
  },
  
  "outcome": {
    "success": true|false,
    "executionTime": "milliseconds",
    "qualityScore": 0-10,
    "issuesFound": 0,
    "actualResult": "Description of outcome",
    "lessonsLearned": ["lesson1", "lesson2"]
  }
}
```

## Naming Convention

Files are named: `dec-YYYY-MM-DD-NNN.json`
- YYYY-MM-DD: Date of decision
- NNN: Sequential number (001, 002, etc.)

## Usage

Decisions are automatically logged by the decision-logging hook after each significant decision.

## Analysis

Use the metrics collection script to analyze patterns:
- Success rate by decision type
- Agent accuracy over time
- Consensus quality trends
- Common failure patterns
