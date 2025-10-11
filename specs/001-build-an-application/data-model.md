# Data Model: Climbing Progress Tracker Application

## Entities

### User

- id: string
- name: string
- email: string
- passwordHash: string
- gradingSystemPreference: string
- accountSettings: object

### ClimbingSession

- id: string
- userId: string
- date: string (ISO8601)
- location: string
- type: string (bouldering, sport)
- difficulty: string
- problems: Problem[]
- notes: string

### Problem

- id: string
- sessionId: string
- name: string
- grade: string
- attempts: number
- sent: boolean

### Goal

- id: string
- userId: string
- targetDifficulty: string
- type: string (bouldering, sport)
- timeframe: string
- progressStatus: string

### GradingSystem

- id: string
- systemName: string
- gradeList: string[]
- associatedGym: string

## Relationships

- User has many ClimbingSessions
- User has many Goals
- User has one GradingSystemPreference
- GradingSystem can be associated with multiple users

## Validation Rules

- All required fields must be present when logging a session
- Email must be valid format
- Password must meet security requirements
- Difficulty must match selected grading system
- Dates must be valid and not in the future

## State Transitions

- Goal: status changes from "active" → "completed" or "abandoned"
- Session: can be edited or deleted by owner

---

# End of Data Model
