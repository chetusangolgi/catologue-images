# Design Document

## Overview

The weighted scoring system will replace the current simple correct/incorrect counting mechanism with a sophisticated scoring algorithm that combines accuracy and time performance. The system will calculate a final score out of 10, where each component (accuracy and time) contributes exactly 50% of the total score.

## Architecture

The scoring system will be implemented through the following components:

1. **Score Calculator Module**: A utility function that computes the weighted score
2. **Game State Enhancement**: Extended game state to track timing information
3. **Results Display Update**: Modified results component to show weighted scores
4. **Database Integration**: Updated data persistence to store weighted scores

## Components and Interfaces

### Score Calculator

```typescript
interface ScoreCalculationInput {
  correctAnswers: number;
  totalQuestions: number;
  timeElapsed: number; // in seconds
  maxTime: number; // in seconds (120)
}

interface ScoreCalculationResult {
  finalScore: number; // out of 10, with 1 decimal precision
  accuracyScore: number; // out of 5
  timeScore: number; // out of 5
  accuracyPercentage: number;
  timeEfficiency: number;
}

function calculateWeightedScore(input: ScoreCalculationInput): ScoreCalculationResult
```

### Enhanced Game State

The existing `GameState` interface will be extended to include:

```typescript
interface GameState {
  // ... existing properties
  gameStartTime: number | null;
  gameEndTime: number | null;
  finalWeightedScore: number | null;
}
```

### Scoring Algorithm

**Accuracy Component (50% weight, max 5 points):**
- Formula: `(correctAnswers / totalQuestions) * 5`
- Linear scaling based on percentage of correct answers

**Time Component (50% weight, max 5 points):**
- Optimal time threshold: 60 seconds (full 5 points)
- Maximum time: 120 seconds (0 points)
- Formula for times between 60-120 seconds: `5 * (120 - timeElapsed) / (120 - 60)`
- Formula for times ≤ 60 seconds: `5` (full points)

**Final Score:**
- Formula: `accuracyScore + timeScore`
- Rounded to 1 decimal place
- Range: 0.0 to 10.0

## Data Models

### Database Schema Updates

The existing game result storage will be updated to include:

```typescript
interface GameResult {
  email: string;
  game_name: string;
  score: number; // This will now be the weighted score (0-10)
  total_questions: number;
  percentage: number; // This will be based on weighted score: (score/10)*100
  time_elapsed?: number; // New field for tracking completion time
  accuracy_score?: number; // New field for accuracy component
  time_score?: number; // New field for time component
}
```

### Webhook Payload Updates

The webhook payload will be updated to send the weighted score:

```typescript
interface WebhookPayload {
  email: string;
  element_id: string;
  game_name: string;
  location: string;
  score: number; // Weighted score (0-10)
}
```

## Error Handling

1. **Invalid Time Values**: If `gameStartTime` is null or invalid, default to maximum time (120 seconds) for time score calculation
2. **Division by Zero**: Handle cases where `totalQuestions` is 0 by returning a score of 0
3. **Negative Time**: If calculated time is negative, default to 0 seconds
4. **Time Exceeding Maximum**: If time exceeds 120 seconds, cap at 120 seconds for calculation

## Testing Strategy

### Unit Tests

1. **Score Calculator Tests**:
   - Test perfect score (all correct, 60 seconds or less)
   - Test zero score (no correct answers, 120 seconds)
   - Test various combinations of accuracy and time
   - Test edge cases (exactly 60 seconds, exactly 120 seconds)
   - Test boundary conditions

2. **Integration Tests**:
   - Test complete quiz flow with weighted scoring
   - Test timeout scenario with weighted scoring
   - Test database persistence of weighted scores
   - Test webhook integration with weighted scores

### Test Cases

| Correct Answers | Time (seconds) | Expected Accuracy Score | Expected Time Score | Expected Final Score |
|----------------|----------------|------------------------|-------------------|-------------------|
| 10/10 | 45 | 5.0 | 5.0 | 10.0 |
| 5/10 | 90 | 2.5 | 2.5 | 5.0 |
| 0/10 | 120 | 0.0 | 0.0 | 0.0 |
| 10/10 | 120 | 5.0 | 0.0 | 5.0 |
| 8/10 | 75 | 4.0 | 3.75 | 7.8 |

## Implementation Considerations

1. **Backward Compatibility**: The system should maintain existing UI patterns while displaying weighted scores
2. **Performance**: Score calculation should be lightweight and not impact game performance
3. **Precision**: All calculations should maintain sufficient precision to avoid rounding errors
4. **User Experience**: The transition to weighted scoring should be seamless for users