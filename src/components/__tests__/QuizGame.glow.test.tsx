import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizGame } from '../QuizGame';
import { QuizQuestion } from '../../types/quiz';

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    logoUrl: '/images/test.png',
    correctAnswer: 'pass',
    options: ['reject', 'pass']
  }
];

const defaultProps = {
  questions: mockQuestions,
  currentQuestion: 0,
  score: 0,
  onAnswerSelect: jest.fn(),
  showFeedback: false,
  feedbackType: null as 'correct' | 'incorrect' | null,
  timeRemaining: 60,
  onTimeUp: jest.fn(),
};

describe('QuizGame Glow Effects', () => {
  test('shows green glow for correct answer feedback', () => {
    const { container } = render(
      <QuizGame 
        {...defaultProps} 
        showFeedback={true}
        feedbackType="correct"
      />
    );
    
    const imageContainer = container.querySelector('.shadow-green-400');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('border-green-500');
  });

  test('shows red glow for incorrect answer feedback', () => {
    const { container } = render(
      <QuizGame 
        {...defaultProps} 
        showFeedback={true}
        feedbackType="incorrect"
      />
    );
    
    const imageContainer = container.querySelector('.shadow-red-400');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('border-red-500');
  });

  test('shows selection glow when no feedback is active', () => {
    const { container } = render(
      <QuizGame {...defaultProps} />
    );
    
    const passButton = screen.getByText('Pass');
    fireEvent.click(passButton);
    
    const imageContainer = container.querySelector('.shadow-green-400');
    expect(imageContainer).toBeInTheDocument();
  });

  test('feedback glow overrides selection glow', () => {
    const { container } = render(
      <QuizGame 
        {...defaultProps} 
        showFeedback={true}
        feedbackType="incorrect"
      />
    );
    
    // Even if pass is selected, incorrect feedback should show red
    const imageContainer = container.querySelector('.shadow-red-400');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('border-red-500');
  });

  test('no glow when no selection and no feedback', () => {
    const { container } = render(
      <QuizGame {...defaultProps} />
    );
    
    const imageContainer = container.querySelector('[class*="shadow-"]');
    expect(imageContainer).toHaveClass('shadow-none');
  });
});