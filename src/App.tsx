import React, { useState, useEffect } from 'react';
import { EmailForm } from './components/EmailForm';
import { QuizGame } from './components/QuizGame';
import { Results } from './components/Results';
import { GameState } from './types/quiz';
import { quizQuestions } from './data/quizData';
import { saveGameResult } from './lib/supabase';

const GAME_DURATION = 120; // 2 minutes in seconds

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'email',
    email: '',
    currentQuestion: 0,
    score: 0,
    answers: [],
    showFeedback: false,
    feedbackType: null,
    timeRemaining: GAME_DURATION,
    gameStartTime: null,
  });

  const [shuffledQuestions, setShuffledQuestions] = useState(quizQuestions);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.currentScreen === 'quiz' && gameState.timeRemaining > 0 && !gameState.showFeedback) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.currentScreen, gameState.timeRemaining, gameState.showFeedback]);

  const handleEmailSubmit = (email: string) => {
    // Shuffle questions when starting the game
    setShuffledQuestions(shuffleArray(quizQuestions));
    
    setGameState(prev => ({
      ...prev,
      email,
      currentScreen: 'quiz',
      gameStartTime: Date.now(),
      timeRemaining: GAME_DURATION
    }));
  };

  const handleTimeUp = async () => {
    // Save results when time is up
    const gameResult = {
      email: gameState.email,
      game_name: 'findthemyth',
      score: gameState.score,
      total_questions: shuffledQuestions.length,
      percentage: Math.round((gameState.score / shuffledQuestions.length) * 100)
    };
    
    try {
      await saveGameResult(gameResult);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'results',
      showFeedback: false,
      feedbackType: null
    }));
  };

  const handleAnswerSelect = async (selectedAnswer: string) => {
    const currentQ = shuffledQuestions[gameState.currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    // Show feedback
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackType: isCorrect ? 'correct' : 'incorrect',
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, isCorrect]
    }));

    // Wait for feedback animation
    setTimeout(async () => {
      const newCurrentQuestion = gameState.currentQuestion + 1;
      
      if (newCurrentQuestion >= shuffledQuestions.length) {
        // Quiz completed - save results and show results screen
        const finalScore = gameState.score + (isCorrect ? 1 : 0);
        
        const gameResult = {
          email: gameState.email,
          game_name: 'findthemyth',
          score: finalScore,
          total_questions: shuffledQuestions.length,
          percentage: Math.round((finalScore / shuffledQuestions.length) * 100)
        };
        
        try {
          await saveGameResult(gameResult);
        } catch (error) {
          console.error('Error saving game result:', error);
        }
        
        setGameState(prev => ({
          ...prev,
          currentScreen: 'results',
          showFeedback: false,
          feedbackType: null
        }));
      } else {
        // Move to next question
        setGameState(prev => ({
          ...prev,
          currentQuestion: newCurrentQuestion,
          showFeedback: false,
          feedbackType: null
        }));
      }
    }, 1500);
  };

  const handleRestart = () => {
    setGameState({
      currentScreen: 'email',
      email: '',
      currentQuestion: 0,
      score: 0,
      answers: [],
      showFeedback: false,
      feedbackType: null,
      timeRemaining: GAME_DURATION,
      gameStartTime: null,
    });
  };

  return (
    <div className="min-h-screen">
      {gameState.currentScreen === 'email' && (
        <EmailForm onEmailSubmit={handleEmailSubmit} />
      )}
      
      {gameState.currentScreen === 'quiz' && (
        <QuizGame
          questions={shuffledQuestions}
          currentQuestion={gameState.currentQuestion}
          score={gameState.score}
          onAnswerSelect={handleAnswerSelect}
          showFeedback={gameState.showFeedback}
          feedbackType={gameState.feedbackType}
          timeRemaining={gameState.timeRemaining}
          onTimeUp={handleTimeUp}
        />
      )}
      
      {gameState.currentScreen === 'results' && (
        <Results
          email={gameState.email}
          score={gameState.score}
          totalQuestions={shuffledQuestions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;