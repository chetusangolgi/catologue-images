// Manual test file for score calculator
// Run with: node src/utils/scoreCalculator.manual-test.js

import { calculateWeightedScore } from './scoreCalculator.js';

console.log('=== Weighted Score Calculator Tests ===\n');

// Test cases from the design document
const testCases = [
  {
    name: 'Perfect score - all correct, 45 seconds',
    input: { correctAnswers: 10, totalQuestions: 10, timeElapsed: 45, maxTime: 120 },
    expected: { finalScore: 10.0, accuracyScore: 5.0, timeScore: 5.0 }
  },
  {
    name: 'Zero score - no correct, 120 seconds',
    input: { correctAnswers: 0, totalQuestions: 10, timeElapsed: 120, maxTime: 120 },
    expected: { finalScore: 0.0, accuracyScore: 0.0, timeScore: 0.0 }
  },
  {
    name: 'Mixed score - 5/10 correct, 90 seconds',
    input: { correctAnswers: 5, totalQuestions: 10, timeElapsed: 90, maxTime: 120 },
    expected: { finalScore: 5.0, accuracyScore: 2.5, timeScore: 2.5 }
  },
  {
    name: 'Perfect accuracy, slow time - 10/10 correct, 120 seconds',
    input: { correctAnswers: 10, totalQuestions: 10, timeElapsed: 120, maxTime: 120 },
    expected: { finalScore: 5.0, accuracyScore: 5.0, timeScore: 0.0 }
  },
  {
    name: 'Good performance - 8/10 correct, 75 seconds',
    input: { correctAnswers: 8, totalQuestions: 10, timeElapsed: 75, maxTime: 120 },
    expected: { finalScore: 7.8, accuracyScore: 4.0, timeScore: 3.8 }
  }
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input:`, testCase.input);
  
  const result = calculateWeightedScore(testCase.input);
  console.log(`Result:`, result);
  
  // Check if results match expected values (with small tolerance for floating point)
  const tolerance = 0.1;
  const finalScoreMatch = Math.abs(result.finalScore - testCase.expected.finalScore) < tolerance;
  const accuracyScoreMatch = Math.abs(result.accuracyScore - testCase.expected.accuracyScore) < tolerance;
  const timeScoreMatch = Math.abs(result.timeScore - testCase.expected.timeScore) < tolerance;
  
  const passed = finalScoreMatch && accuracyScoreMatch && timeScoreMatch;
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (!passed) {
    console.log(`Expected:`, testCase.expected);
  }
  
  console.log('---\n');
});

console.log('=== Manual Testing Complete ===');
console.log('To run this test: node src/utils/scoreCalculator.manual-test.js');
console.log('Make sure to build the TypeScript first or use ts-node');