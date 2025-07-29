import React, { useState } from 'react';

interface EmailFormProps {
  onEmailSubmit: (email: string) => void;
}

export function EmailForm({ onEmailSubmit }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onEmailSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 py-10 relative gap-[50px]">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: 'url(/background.png)' }}
  />

  {/* Content */}
  <div className="w-full max-w-xl mx-auto flex flex-col items-center relative z-10">
    <h1 className="text-[48px] font-bold text-[#00B5DB] text-center mb-12">
      Catalogue Images Game
    </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-20">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValid(true);
              }}
              className="w-[774px] h-[131px] px-6 py-4 text-[60px] text-white text-center placeholder-white bg-[#5E7CBA]/80 rounded-xl border-2 border-[#2B3990] focus:outline-none focus:ring-2 focus:ring-blue-400"

              placeholder="Enter E-mail address"
              required
            />
            {!isValid && (
              <p className="text-red-300 text-sm mt-2">Please enter a valid email address</p>
            )}
          </div>

          <button
            type="submit"
            className="w-[551px] h-[128px] text-[60px] font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] shadow-md transition"
          >
            Play
          </button>
        </form>
      </div>
    </div>
  );
}
