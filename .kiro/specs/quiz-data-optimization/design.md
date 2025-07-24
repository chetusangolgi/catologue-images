# Design Document

## Overview

This design outlines the optimization of quiz data by replacing external image URLs with local images and reducing the quiz from 10 to 8 questions. The change will improve loading performance and reduce external dependencies.

## Architecture

The quiz data structure remains the same, with only the `logoUrl` property values changing from external URLs to local file paths. The quiz logic and components don't require architectural changes.

## Components and Interfaces

### QuizQuestion Interface
The existing `QuizQuestion` interface remains unchanged:
- `id`: number
- `logoUrl`: string (will reference local paths)
- `correctAnswer`: string
- `options`: string[]

### Quiz Data Module
- Location: `src/data/quizData.ts`
- Exports: `quizQuestions` array with 8 questions
- Image references: Local paths using `/images/` prefix

## Data Models

### Image Mapping Strategy
Map the 8 available local images to quiz questions:
- Image1.png → Question 1
- Image2.png → Question 2
- Image3.png → Question 3
- Image4.png → Question 4
- Image5.png → Question 5
- Image6.jpg → Question 6
- Image7.png → Question 7
- Image8.png → Question 8

### Quiz Question Updates
- Reduce total questions from 10 to 8
- Update `logoUrl` to use `/images/ImageX.png` format
- Maintain existing question structure and answer options
- Keep sequential ID numbering (1-8)

## Error Handling

### Image Loading
- Local images should load faster and more reliably
- Browser will handle missing image scenarios with standard broken image display
- No additional error handling required for image loading

### Quiz Logic
- Existing quiz logic should handle 8 questions without modification
- Results calculation will automatically adjust to 8-question format

## Testing Strategy

### Manual Testing
- Verify all 8 images load correctly in the quiz interface
- Confirm quiz progression works with 8 questions
- Test results calculation with reduced question count

### Visual Testing
- Ensure image quality and sizing remains consistent
- Verify no broken image placeholders appear
- Confirm quiz flow feels natural with 8 questions

### Performance Testing
- Compare loading times before and after local image implementation
- Verify reduced network requests improve initial load performance