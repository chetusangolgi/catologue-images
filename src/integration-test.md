# Weighted Scoring System Integration Test

## Test Scenarios

### Scenario 1: Perfect Performance
1. Start the quiz
2. Answer all questions correctly
3. Complete in under 60 seconds
4. **Expected Result**: Score should be 10.0/10

### Scenario 2: Good Performance
1. Start the quiz
2. Answer 8 out of 10 questions correctly
3. Complete in 75 seconds
4. **Expected Result**: Score should be approximately 7.8/10
   - Accuracy: 4.0/5 (80% correct)
   - Time: 3.8/5 (75 seconds = 75% efficiency)

### Scenario 3: Poor Performance
1. Start the quiz
2. Answer 3 out of 10 questions correctly
3. Let timer run to 120 seconds (timeout)
4. **Expected Result**: Score should be 1.5/10
   - Accuracy: 1.5/5 (30% correct)
   - Time: 0.0/5 (timeout)

### Scenario 4: Zero Score
1. Start the quiz
2. Answer 0 questions correctly
3. Let timer run to 120 seconds (timeout)
4. **Expected Result**: Score should be 0.0/10
5. **Expected UI**: "Better luck next time!" message

## Verification Points

### Database Integration
- Check that Supabase receives the weighted score (0-10 scale)
- Verify percentage is calculated as (score/10)*100

### Webhook Integration
- Confirm webhook receives weighted score in payload
- Verify score field contains weighted score, not raw correct count

### UI Display
- Score displayed with one decimal place (e.g., "7.8/10")
- Congratulations message for scores > 0
- "Better luck next time" message for score = 0
- Proper formatting and layout maintained

## Manual Testing Steps

1. Run the application: `npm run dev`
2. Complete each test scenario
3. Check browser console for webhook/database logs
4. Verify UI displays correct weighted scores
5. Confirm database entries contain weighted scores

## Automated Testing

The score calculation logic has comprehensive unit tests in:
`src/utils/__tests__/scoreCalculator.test.ts`

To add proper testing framework:
1. Install Jest: `npm install --save-dev jest @types/jest ts-jest`
2. Add test script to package.json: `"test": "jest"`
3. Run tests: `npm test`