import React, { useEffect, useState } from 'react';
import { QuizQuestion } from '../types/quiz';

interface QuizGameProps {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  onAnswerSelect: (selectedAnswer: string) => void;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  timeRemaining: number;
  onTimeUp: () => void;
}

export function QuizGame({
  questions,
  currentQuestion,
  score,
  onAnswerSelect,
  showFeedback,
  feedbackType,
  timeRemaining,
  onTimeUp,
}: QuizGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const question = questions[currentQuestion];

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return; // Prevent clicking during feedback
    
    setSelectedAnswer(answer);
    onAnswerSelect(answer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBorderColor = () => {
    if (selectedAnswer === 'pass') return 'border-green-500';
    if (selectedAnswer === 'reject') return 'border-red-500';
    return 'border-transparent';
  };

  const getGlowClass = () => {
    if (selectedAnswer === 'pass') return 'shadow-[0_0_25px] shadow-green-400';
    if (selectedAnswer === 'reject') return 'shadow-[0_0_25px] shadow-red-400';
    return 'shadow-none';
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-4 relative">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/background.png)' }}
    ></div>

    {/* Header */}
    <div className="relative z-10 text-center px-4 mb-8">
      <h2 className="text-[#00B5DB] text-lg sm:text-xl md:text-2xl font-bold leading-snug">
        Select if the Image is to be<br />
        rejected or passed as per<br />
        Catalogue Guidelines
      </h2>
    </div>

    {/* Glowing Image */}
    <div
      className={`relative z-10 border-4 ${getBorderColor()} rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg transition-all duration-300 ${getGlowClass()} mb-6`}
    >
      <img
        src={question.logoUrl}
        alt="Quiz visual"
        className="w-full rounded"
      />
    </div>

    {/* Action Buttons */}
    <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap mb-8">
      <button
        onClick={() => handleAnswerClick('reject')}
        disabled={showFeedback}
        className={`px-12 py-4 rounded-lg text-base sm:text-lg font-semibold ${
          selectedAnswer === 'reject'
            ? 'bg-red-600 text-white'
            : 'bg-white text-red-600 border-2 border-red-500'
        }`}
      >
        Reject
      </button>

      <button
        onClick={() => handleAnswerClick('pass')}
        disabled={showFeedback}
        className={`px-14 py-4 rounded-lg text-base sm:text-lg font-semibold ${
          selectedAnswer === 'pass'
            ? 'bg-green-600 text-white'
            : 'bg-white text-green-600 border-2 border-green-500'
        }`}
      >
        Pass
      </button>
    </div>

    {/* Timer */}
    <div className="relative z-10 flex items-center justify-center bg-yellow-400 px-4 py-1.5 rounded-full text-[#3B2EDB] font-bold text-base sm:text-lg">
      <div className="w-2.5 h-2.5 bg-[#3B2EDB] rounded-full mr-2" />
      {formatTime(timeRemaining)}
    </div>
  </div>
  );
}
