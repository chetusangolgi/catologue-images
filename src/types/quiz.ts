export interface QuizQuestion {
  id: number;
  logoUrl: string;
  correctAnswer: string;
  options: [string, string];
}

export interface GameState {
  currentScreen: 'email' | 'quiz' | 'results';
  email: string;
  currentQuestion: number;
  score: number;
  answers: boolean[];
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  timeRemaining: number;
  gameStartTime: number | null;
  gameEndTime: number | null;
  finalWeightedScore: number | null;
}