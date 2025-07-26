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

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    onAnswerSelect(answer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBorderColor = () => {
    // Priority 1: Feedback-based border
    if (showFeedback && feedbackType === 'correct') {
      return 'border-green-500';
    }
    if (showFeedback && feedbackType === 'incorrect') {
      return 'border-red-500';
    }

    // Priority 2: Selection-based border (existing logic)
    if (selectedAnswer === 'pass') return 'border-green-500';
    if (selectedAnswer === 'reject') return 'border-red-500';
    return 'border-transparent';
  };

  const getGlowClass = () => {
    // Priority 1: Feedback-based glow
    if (showFeedback && feedbackType === 'correct') {
      return 'shadow-[0_0_25px] shadow-green-400';
    }
    if (showFeedback && feedbackType === 'incorrect') {
      return 'shadow-[0_0_25px] shadow-red-400';
    }

    // Priority 2: Selection-based glow (existing logic)
    if (selectedAnswer === 'pass') return 'shadow-[0_0_25px] shadow-green-400';
    if (selectedAnswer === 'reject') return 'shadow-[0_0_25px] shadow-red-400';
    return 'shadow-none';
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-4 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/s2.png)' }}
      ></div>

      {/* Header and Image Section */}
      <div className="w-full mx-auto flex flex-col items-center justify-center z-10 h-[50%] mt-60 ">
        {/* Header */}
        <div className="relative z-10 text-center px-4 mb-8 w-[92%]">
          <h2 className="text-[#00B5DB] text-[60px] font-bold leading-tight mb-4">
            Select if the Image is to be
            rejected or passed as per
            Catalogue Guidelines
          </h2>
        </div>



        {/* Glowing Image */}
        <div
          className={`relative z-10 border-4 ${getBorderColor()} rounded-lg w-[500px] aspect-square transition-all duration-300 ${getGlowClass()} mb-10`}
        >
          <img
            src={question.logoUrl}
            alt="Quiz visual"
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-8 flex-wrap mb-8 w-full">
          {/* Reject Button */}
          <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#4216EF] to-[#11BBDE]">
            <button
              onClick={() => handleAnswerClick('reject')}
              disabled={showFeedback}
              className={`w-[300px] py-5 rounded-lg text-4xl font-bold ${selectedAnswer === 'reject' ? 'bg-red-600 text-white' : 'bg-white text-[#00B5DB]'}`}
            >
              Reject
            </button>
          </div>

          {/* Pass Button */}
          <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#4216EF] to-[#11BBDE]">
            <button
              onClick={() => handleAnswerClick('pass')}
              disabled={showFeedback}
              className={`w-[300px] py-5 rounded-lg text-4xl font-bold ${selectedAnswer === 'pass' ? 'bg-green-600 text-white' : 'bg-white text-[#00B5DB]'}`}
            >
              Pass
            </button>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div
        className="absolute bottom-10 left-0 w-full px-10 z-10 flex items-center justify-center gap-4 text-[60px] font-bold text-white"
        style={{
          background:
            'linear-gradient(to right, #30c5e5 0%, rgba(48,197,229,0.05) 45%, rgba(6,50,185,0.05) 55%, #0632b9 100%)',
        }}
      >
        <img src="/timer.png" alt="Timer" className="w-[110px] h-[110px]" />
        <span>{formatTime(timeRemaining)}</span>
      </div>
    </div>
  );
}
