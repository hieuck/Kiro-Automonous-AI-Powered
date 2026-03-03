# Team Metrics

This directory stores performance metrics for the autonomous AI team.

## Metrics Tracked

### Team Performance
- Autonomy rate (% decisions without external escalation)
- Decision accuracy (% successful outcomes)
- Consensus success rate
- Cycle time (task start to completion)
- Quality scores

### Agent Performance
- Decision accuracy per agent
- Response time
- Confidence calibration
- Contribution quality

## Files

- `monthly-YYYY-MM.json` - Monthly aggregated metrics
- `weekly-YYYY-WW.json` - Weekly metrics

## Usage

Metrics are automatically collected and updated by:
- Decision logging hook
- Quality gate check hook
- Weekly self-assessment hook
- Monthly organizational review hook
