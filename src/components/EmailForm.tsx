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
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm space-y-8">
        <h1 className="text-4xl font-bold text-[#00B5DB] pb-4">Catalogue Images</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValid(true);
              }}
              className={`w-full px-6 py-4 text-white text-center text-lg rounded-xl border ${isValid ? 'border-[#5E7CBA]' : 'border-red-400'
                } bg-[#5E7CBA]/80 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300`}
              placeholder="Enter E-mail address"
              required
            />
            {!isValid && (
              <p className="text-red-300 text-sm mt-2">Please enter a valid email address</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#4126FF] text-white text-xl font-semibold shadow-md hover:bg-[#321AD9] transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
