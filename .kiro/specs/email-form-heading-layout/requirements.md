# Requirements Document

## Introduction

The "Catalogue Images" heading in the EmailForm component is currently wrapping to two lines instead of displaying on a single line as intended. This creates a poor user experience and doesn't match the design expectations. We need to fix the heading layout to ensure it displays properly on a single line while maintaining responsive design principles.

## Requirements

### Requirement 1

**User Story:** As a user visiting the email form page, I want the "Catalogue Images" heading to display on a single line, so that the page looks professional and matches the intended design.

#### Acceptance Criteria

1. WHEN the email form page loads THEN the "Catalogue Images" heading SHALL display on a single line
2. WHEN viewed on desktop screens THEN the heading SHALL remain on a single line without wrapping
3. WHEN viewed on mobile devices THEN the heading SHALL either display on a single line or gracefully adapt with appropriate font sizing

### Requirement 2

**User Story:** As a user on different devices, I want the heading to be readable and properly sized, so that I can easily understand the page purpose regardless of my screen size.

#### Acceptance Criteria

1. WHEN viewed on screens smaller than 768px THEN the heading SHALL use responsive font sizing to prevent wrapping
2. WHEN the heading text is too long for the container THEN the system SHALL use appropriate CSS techniques to maintain single-line display
3. IF the heading cannot fit on a single line THEN the system SHALL reduce font size or adjust spacing to accommodate the text

### Requirement 3

**User Story:** As a developer maintaining the codebase, I want the heading layout solution to be maintainable and follow best practices, so that future changes don't break the layout.

#### Acceptance Criteria

1. WHEN implementing the fix THEN the solution SHALL use responsive design principles
2. WHEN the heading text changes in the future THEN the layout SHALL automatically adapt to maintain single-line display
3. WHEN viewed across different browsers THEN the heading SHALL display consistently