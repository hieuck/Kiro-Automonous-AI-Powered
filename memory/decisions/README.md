# Decision Tracking System

This directory stores all team decisions for learning and continuous improvement.

## Structure

- `index.json` - Index of all decisions with metadata
- `dec-YYYY-MM-DD-NNN.json` - Individual decision records

## Decision Record Format

Each decision is stored as a JSON file with:
- Context and description
- Agent responses with confidence levels
- Consensus calculation
- Final decision and rationale
- Outcome tracking (added after execution)

## Usage

The Team Coordinator automatically:
1. Creates decision records during team consultations
2. Tracks outcomes after task completion
3. Updates agent weights weekly based on accuracy
4. Generates reports for learning

See `.kiro/skills/team-coordinator/references/decision-tracking-guide.md` for details.
