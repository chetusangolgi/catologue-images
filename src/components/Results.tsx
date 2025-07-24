import React, { useEffect, useState } from 'react';
import { saveCatalogueImageResult } from '../lib/supabase';

interface ResultsProps {
  email: string;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function Results({ email, score, totalQuestions, onRestart }: ResultsProps) {
  const [countdown, setCountdown] = useState(5);
  const isZero = score === 0;

  // Send results to webhook API and save to Supabase
  useEffect(() => {
    const sendResults = async () => {
      try {
        // Send to webhook
        const payload = {
          email: email,
          element_id: "06",
          game_name: "Catalogue Images",
          location: "surat",
          score: score
        };

        console.log('Sending quiz results to webhook:', payload);

        const response = await fetch('https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          console.log('Quiz results successfully sent to webhook');
        } else {
          console.log('Webhook response status:', response.status);
        }
      } catch (error) {
        console.error('Error sending results to webhook:', error);
      }

      // Save to Supabase database
      try {
        const supabaseResult = await saveCatalogueImageResult({
          email: email,
          score: score
        });

        if (supabaseResult) {
          console.log('Quiz results successfully saved to Supabase database');
        } else {
          console.log('Failed to save quiz results to Supabase database');
        }
      } catch (error) {
        console.error('Error saving results to Supabase:', error);
      }
    };

    sendResults();
  }, [email, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onRestart]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative"
      style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Trophy or Better Luck Image */}
        <img
          src={isZero ? '/luck.png' : '/congrats.png'}
          alt={isZero ? 'Better luck' : 'Congratulations'}
          className="w-48 sm:w-56 mb-6"
        />

        {/* Text */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {isZero ? 'Better luck next time!' : 'CONGRATULATIONS!'}
        </h1>
        <p className="text-white text-lg sm:text-xl mb-1">You got!</p>
        <p className="text-white text-5xl sm:text-6xl font-extrabold mb-2">
          {score}/{totalQuestions}
        </p>
        <p className="text-white text-lg sm:text-xl mb-6">Correct answers!</p>


      </div>
    </div>
  );
}
