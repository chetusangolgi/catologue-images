import React, { useState, useEffect } from 'react';
import { EmailForm } from './components/EmailForm';
import { QuizGame } from './components/QuizGame';
import { Results } from './components/Results';
import { GameState } from './types/quiz';
import { quizQuestions } from './data/quizData';
import { saveGameResult } from './lib/supabase';
import { calculateWeightedScore } from './utils/scoreCalculator';

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
    gameEndTime: null,
    finalWeightedScore: null,
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
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
  
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
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
    // Calculate weighted score when time is up
    const timeElapsed = gameState.gameStartTime ? GAME_DURATION - gameState.timeRemaining : GAME_DURATION;
    const weightedScoreResult = calculateWeightedScore({
      correctAnswers: gameState.score,
      totalQuestions: shuffledQuestions.length,
      timeElapsed,
      maxTime: GAME_DURATION
    });

    const gameResult = {
      email: gameState.email,
      game_name: 'findthemyth',
      score: weightedScoreResult.finalScore,
      total_questions: shuffledQuestions.length,
      percentage: Math.round((weightedScoreResult.finalScore / 10) * 100)
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
      feedbackType: null,
      gameEndTime: Date.now(),
      finalWeightedScore: weightedScoreResult.finalScore
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
        // Quiz completed - calculate weighted score and save results
        const finalCorrectAnswers = gameState.score + (isCorrect ? 1 : 0);
        const timeElapsed = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : GAME_DURATION;
        
        const weightedScoreResult = calculateWeightedScore({
          correctAnswers: finalCorrectAnswers,
          totalQuestions: shuffledQuestions.length,
          timeElapsed,
          maxTime: GAME_DURATION
        });
        
        const gameResult = {
          email: gameState.email,
          game_name: 'findthemyth',
          score: weightedScoreResult.finalScore,
          total_questions: shuffledQuestions.length,
          percentage: Math.round((weightedScoreResult.finalScore / 10) * 100)
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
          feedbackType: null,
          gameEndTime: Date.now(),
          finalWeightedScore: weightedScoreResult.finalScore
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
      gameEndTime: null,
      finalWeightedScore: null,
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
          score={gameState.finalWeightedScore || 0}
          totalQuestions={shuffledQuestions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;