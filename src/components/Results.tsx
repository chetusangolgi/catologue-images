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
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      <div className="relative z-10 flex flex-col items-center mt-[230px]">
        {/* Trophy or Better Luck Image */}
        <img
          src={isZero ? '/luck.png' : '/congrats.png'}
          alt={isZero ? 'Better luck' : 'Congratulations'}
    className="w-[700px] mb-0" // ← Removed margin below image
        />


        <div className="mt-[70px]"> {/* Added margin-top to text block */}
          {isZero ? (
            <>
              <h1 className="text-[70px] font-extrabold text-white mb-2 leading-tight">
                Better luck next time!
              </h1>
              <p className="text-white text-[96px] font-bold mb-1 leading-none">
                {score}/{totalQuestions}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[70px] font-extrabold text-white mb-2 leading-[1.1]">
                CONGRATULATIONS!
              </h1>
              <p className="text-white text-[60px] mb-1 leading-[1.1]">You got!</p>
              <p className="text-white text-[96px] font-bold mb-1 leading-none">
                {score}/{totalQuestions}
              </p>
              <p className="text-white text-[60px] leading-[1.1]">Correct answers!</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
