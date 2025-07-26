# Requirements Document

## Introduction

This feature enhances the quiz game scoring system to implement a weighted scoring mechanism that combines both accuracy (correct answers) and time performance. The new system will calculate a final score out of 10, where 50% of the score comes from the number of correct answers and 50% comes from time efficiency.

## Requirements

### Requirement 1

**User Story:** As a quiz player, I want my final score to reflect both my accuracy and speed, so that I am rewarded for both getting answers right and answering quickly.

#### Acceptance Criteria

1. WHEN the quiz is completed THEN the system SHALL calculate a weighted score out of 10
2. WHEN calculating the weighted score THEN the system SHALL allocate 50% weight to accuracy (correct answers)
3. WHEN calculating the weighted score THEN the system SHALL allocate 50% weight to time performance
4. WHEN all questions are answered correctly THEN the accuracy component SHALL contribute 5 points to the final score
5. WHEN the quiz is completed in minimal time THEN the time component SHALL contribute 5 points to the final score

### Requirement 2

**User Story:** As a quiz player, I want to see my weighted score displayed clearly, so that I understand how my performance was evaluated.

#### Acceptance Criteria

1. WHEN the results screen is displayed THEN the system SHALL show the final weighted score out of 10
2. WHEN the results screen is displayed THEN the system SHALL display the score with one decimal place precision
3. WHEN the results screen is displayed THEN the system SHALL maintain the existing congratulations/better luck messaging based on performance
4. WHEN the score is 0 THEN the system SHALL continue to show the "Better luck next time" message

### Requirement 3

**User Story:** As a system administrator, I want the weighted scoring to be saved to the database, so that player performance can be tracked accurately.

#### Acceptance Criteria

1. WHEN quiz results are saved to Supabase THEN the system SHALL store the weighted score instead of the raw correct answer count
2. WHEN quiz results are sent to the webhook THEN the system SHALL send the weighted score instead of the raw correct answer count
3. WHEN the game times out THEN the system SHALL calculate and save the weighted score based on answers given up to that point
4. WHEN the quiz is completed normally THEN the system SHALL calculate and save the weighted score based on all answers and total time taken

### Requirement 4

**User Story:** As a quiz player, I want the time component to reward faster completion, so that efficient answering is incentivized.

#### Acceptance Criteria

1. WHEN calculating time score THEN the system SHALL use the total time taken to complete the quiz
2. WHEN the quiz is completed in 60 seconds or less THEN the time component SHALL contribute the full 5 points
3. WHEN the quiz takes the full 120 seconds THEN the time component SHALL contribute 0 points
4. WHEN the quiz completion time is between 60 and 120 seconds THEN the time component SHALL be calculated proportionally
5. WHEN the quiz times out at 120 seconds THEN the time component SHALL contribute 0 points