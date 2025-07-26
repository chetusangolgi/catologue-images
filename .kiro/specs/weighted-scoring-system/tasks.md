# Implementation Plan

- [x] 1. Create score calculation utility module


  - Create a new utility file with the weighted scoring algorithm
  - Implement the `calculateWeightedScore` function with accuracy and time components
  - Add TypeScript interfaces for score calculation input and result
  - Write unit tests to verify scoring calculations for various scenarios
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_



- [ ] 2. Update game state management for timing tracking
  - Extend the GameState interface to include gameEndTime and finalWeightedScore fields
  - Modify the App component to track game end time when quiz completes


  - Update game state initialization to properly handle new timing fields
  - _Requirements: 1.1, 4.1_

- [ ] 3. Integrate weighted scoring into quiz completion flow
  - Update the handleAnswerSelect function to calculate weighted score on quiz completion


  - Update the handleTimeUp function to calculate weighted score on timeout
  - Ensure both completion paths use the new scoring system
  - Replace raw score usage with weighted score in game result creation
  - _Requirements: 1.1, 1.2, 1.3, 3.3, 3.4_



- [ ] 4. Update Results component to display weighted scores
  - Modify the Results component to accept and display weighted score (0-10 scale)
  - Update the score display formatting to show one decimal place
  - Maintain existing congratulations/better luck messaging logic


  - Ensure zero score still triggers "Better luck next time" message
  - _Requirements: 2.1, 2.2, 2.3, 2.4_


- [ ] 5. Update database integration for weighted scores
  - Modify the saveGameResult function calls to use weighted scores
  - Update the saveCatalogueImageResult function calls to use weighted scores
  - Ensure percentage calculation is based on weighted score (score/10)*100
  - _Requirements: 3.1, 3.2_

- [ ] 6. Update webhook integration for weighted scores
  - Modify the webhook payload to send weighted score instead of raw score
  - Ensure the webhook API receives the correct weighted score format
  - _Requirements: 3.2_

- [ ] 7. Add comprehensive testing for weighted scoring system
  - Create unit tests for the score calculation utility
  - Add integration tests for the complete scoring flow
  - Test edge cases including timeout scenarios and perfect scores
  - Verify database and webhook integration with weighted scores
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_