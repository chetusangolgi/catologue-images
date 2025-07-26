# Design Document

## Overview

This design outlines the implementation of visual feedback for quiz answers through image glow effects. When users select an answer, the quiz image will glow green for correct answers and red for incorrect answers, providing immediate visual confirmation of their choice accuracy.

## Architecture

The glow effect will be implemented by enhancing the existing `QuizGame` component's styling logic. The component already has access to the `feedbackType` prop which indicates whether an answer is correct or incorrect, making this the ideal trigger for the glow effect.

### Current Architecture Integration
- Leverage existing `feedbackType` prop ('correct' | 'incorrect' | null)
- Extend current `getGlowClass()` method to include feedback-based glowing
- Maintain existing component structure and props interface

## Components and Interfaces

### QuizGame Component Enhancement
The `QuizGame` component will be modified to:
- Update the `getGlowClass()` method to handle feedback-based glowing
- Modify the `getBorderColor()` method to include feedback colors
- Ensure glow effects reset properly between questions

### Props Interface (No Changes Required)
The existing `QuizGameProps` interface already provides necessary data:
- `feedbackType: 'correct' | 'incorrect' | null` - triggers glow effect
- `showFeedback: boolean` - controls when feedback is displayed
- `currentQuestion: number` - helps reset glow state between questions

## Data Models

### Glow State Logic
The glow effect will be determined by combining two factors:
1. **Selection State**: Current user selection ('pass' | 'reject' | null)
2. **Feedback State**: Answer correctness ('correct' | 'incorrect' | null)

### Glow Priority System
1. **Feedback Glow** (Highest Priority): Green/red based on answer correctness
2. **Selection Glow** (Lower Priority): Blue glow based on current selection
3. **No Glow** (Default): Neutral state when no selection or feedback

### CSS Classes Structure
```typescript
// Feedback-based glow (highest priority)
feedbackType === 'correct' → 'shadow-[0_0_25px] shadow-green-400 border-green-500'
feedbackType === 'incorrect' → 'shadow-[0_0_25px] shadow-red-400 border-red-500'

// Selection-based glow (fallback when no feedback)
selectedAnswer === 'pass' → 'shadow-[0_0_25px] shadow-green-400 border-green-500'
selectedAnswer === 'reject' → 'shadow-[0_0_25px] shadow-red-400 border-red-500'
```

## Error Handling

### State Management
- Ensure glow state resets properly when `currentQuestion` changes
- Handle edge cases where `feedbackType` might be inconsistent
- Graceful fallback to selection-based glow if feedback state is unclear

### Visual Consistency
- Maintain consistent glow intensity across different screen sizes
- Ensure glow effects don't interfere with image visibility
- Handle potential CSS conflicts with existing styles

## Testing Strategy

### Visual Testing
- Verify green glow appears for correct answers across all questions
- Confirm red glow appears for incorrect answers across all questions
- Test glow reset behavior when transitioning between questions
- Validate glow visibility against different background conditions

### Interaction Testing
- Test glow behavior with rapid answer selection
- Verify glow state during feedback display period
- Confirm proper glow clearing when moving to next question

### Cross-browser Testing
- Ensure shadow effects render consistently across browsers
- Test glow performance on different devices and screen sizes
- Validate CSS transitions work smoothly

## Implementation Details

### Method Updates Required

#### Enhanced getGlowClass() Method
```typescript
const getGlowClass = () => {
  // Priority 1: Feedback-based glow
  if (showFeedback && feedbackType === 'correct') {
    return 'shadow-[0_0_25px] shadow-green-400';
  }
  if (showFeedback && feedbackType === 'incorrect') {
    return 'shadow-[0_0_25px] shadow-red-400';
  }
  
  // Priority 2: Selection-based glow (existing logic)
  if (selectedAnswer === 'pass') return 'shadow-[0_0_25px] shadow-green-400';
  if (selectedAnswer === 'reject') return 'shadow-[0_0_25px] shadow-red-400';
  
  return 'shadow-none';
};
```

#### Enhanced getBorderColor() Method
```typescript
const getBorderColor = () => {
  // Priority 1: Feedback-based border
  if (showFeedback && feedbackType === 'correct') {
    return 'border-green-500';
  }
  if (showFeedback && feedbackType === 'incorrect') {
    return 'border-red-500';
  }
  
  // Priority 2: Selection-based border (existing logic)
  if (selectedAnswer === 'pass') return 'border-green-500';
  if (selectedAnswer === 'reject') return 'border-red-500';
  
  return 'border-transparent';
};
```

### Transition Effects
- Maintain existing `transition-all duration-300` for smooth glow changes
- Ensure feedback glow overrides selection glow seamlessly
- Provide smooth transition back to neutral state between questions