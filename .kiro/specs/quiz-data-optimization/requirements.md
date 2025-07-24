# Requirements Document

## Introduction

Update quiz to use 8 local images instead of 10 external URLs.

## Requirements

### Requirement 1

**User Story:** As a user, I want the quiz to use local images, so that it loads faster.

#### Acceptance Criteria

1. WHEN the quiz loads THEN the system SHALL use images from public/images directory
2. WHEN quiz data is updated THEN the system SHALL reference 8 local image files

### Requirement 2

**User Story:** As a user, I want 8 quiz questions, so that the quiz is shorter.

#### Acceptance Criteria

1. WHEN the quiz starts THEN the system SHALL present exactly 8 questions
2. WHEN the quiz completes THEN the system SHALL calculate results based on 8 questions