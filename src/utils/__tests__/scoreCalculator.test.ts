import { calculateWeightedScore, ScoreCalculationInput } from '../scoreCalculator';

describe('calculateWeightedScore', () => {
  const maxTime = 120;

  test('perfect score - all correct answers in 45 seconds', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 10,
      totalQuestions: 10,
      timeElapsed: 45,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(10.0);
    expect(result.accuracyScore).toBe(5.0);
    expect(result.timeScore).toBe(5.0);
    expect(result.accuracyPercentage).toBe(100);
    expect(result.timeEfficiency).toBe(100);
  });

  test('zero score - no correct answers in 120 seconds', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 0,
      totalQuestions: 10,
      timeElapsed: 120,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(0.0);
    expect(result.accuracyScore).toBe(0.0);
    expect(result.timeScore).toBe(0.0);
    expect(result.accuracyPercentage).toBe(0);
    expect(result.timeEfficiency).toBe(0);
  });

  test('mixed score - 5/10 correct in 90 seconds', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 5,
      totalQuestions: 10,
      timeElapsed: 90,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(5.0);
    expect(result.accuracyScore).toBe(2.5);
    expect(result.timeScore).toBe(2.5);
    expect(result.accuracyPercentage).toBe(50);
    expect(result.timeEfficiency).toBe(50);
  });

  test('perfect accuracy but slow time - 10/10 correct in 120 seconds', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 10,
      totalQuestions: 10,
      timeElapsed: 120,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(5.0);
    expect(result.accuracyScore).toBe(5.0);
    expect(result.timeScore).toBe(0.0);
    expect(result.accuracyPercentage).toBe(100);
    expect(result.timeEfficiency).toBe(0);
  });

  test('good accuracy and time - 8/10 correct in 75 seconds', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 8,
      totalQuestions: 10,
      timeElapsed: 75,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(7.8);
    expect(result.accuracyScore).toBe(4.0);
    expect(result.timeScore).toBe(3.8);
    expect(result.accuracyPercentage).toBe(80);
    expect(result.timeEfficiency).toBe(75);
  });

  test('exactly 60 seconds - should get full time points', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 5,
      totalQuestions: 10,
      timeElapsed: 60,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.timeScore).toBe(5.0);
    expect(result.timeEfficiency).toBe(100);
  });

  test('edge case - zero total questions', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 0,
      totalQuestions: 0,
      timeElapsed: 60,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.finalScore).toBe(0.0);
    expect(result.accuracyScore).toBe(0.0);
    expect(result.timeScore).toBe(0.0);
    expect(result.accuracyPercentage).toBe(0);
    expect(result.timeEfficiency).toBe(0);
  });

  test('edge case - negative time should be clamped to 0', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 5,
      totalQuestions: 10,
      timeElapsed: -10,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.timeScore).toBe(5.0);
    expect(result.timeEfficiency).toBe(100);
  });

  test('edge case - time exceeding maximum should be clamped', () => {
    const input: ScoreCalculationInput = {
      correctAnswers: 5,
      totalQuestions: 10,
      timeElapsed: 150,
      maxTime
    };

    const result = calculateWeightedScore(input);

    expect(result.timeScore).toBe(0.0);
    expect(result.timeEfficiency).toBe(0);
  });
});