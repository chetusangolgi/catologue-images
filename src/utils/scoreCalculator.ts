export interface ScoreCalculationInput {
  correctAnswers: number;
  totalQuestions: number;
  timeElapsed: number; // in seconds
  maxTime: number; // in seconds (120)
}

export interface ScoreCalculationResult {
  finalScore: number; // out of 10, with 1 decimal precision
  accuracyScore: number; // out of 5
  timeScore: number; // out of 5
  accuracyPercentage: number;
  timeEfficiency: number;
}

export function calculateWeightedScore(input: ScoreCalculationInput): ScoreCalculationResult {
  const { correctAnswers, totalQuestions, timeElapsed, maxTime } = input;

  // Handle edge cases
  if (totalQuestions === 0) {
    return {
      finalScore: 0.0,
      accuracyScore: 0.0,
      timeScore: 0.0,
      accuracyPercentage: 0,
      timeEfficiency: 0
    };
  }

  // Calculate accuracy component (50% weight, max 5 points)
  const accuracyPercentage = (correctAnswers / totalQuestions) * 100;
  const accuracyScore = (correctAnswers / totalQuestions) * 5;

  // Calculate time component (50% weight, max 5 points)
  // Optimal time threshold: 60 seconds (full 5 points)
  // Maximum time: 120 seconds (0 points)
  let timeScore = 0;
  let timeEfficiency = 0;
  
  const clampedTime = Math.max(0, Math.min(timeElapsed, maxTime));
  
  if (clampedTime <= 60) {
    timeScore = 5; // Full points for 60 seconds or less
    timeEfficiency = 100;
  } else {
    // Linear scaling between 60 and 120 seconds
    timeScore = 5 * (maxTime - clampedTime) / (maxTime - 60);
    timeEfficiency = ((maxTime - clampedTime) / (maxTime - 60)) * 100;
  }

  // Calculate final score
  const finalScore = Math.round((accuracyScore + timeScore) * 10) / 10; // Round to 1 decimal place

  return {
    finalScore,
    accuracyScore: Math.round(accuracyScore * 10) / 10,
    timeScore: Math.round(timeScore * 10) / 10,
    accuracyPercentage: Math.round(accuracyPercentage),
    timeEfficiency: Math.round(timeEfficiency)
  };
}