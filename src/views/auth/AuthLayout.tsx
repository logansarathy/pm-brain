import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#FFFDF9] text-[#1E1E1E] flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-[#FF7A00] selection:text-white font-sans transition-opacity duration-300">
      {/* Top Header - Minimal PM OS Logo & Subtitle */}
      <header className="w-full max-w-md flex flex-col items-center text-center pt-2 sm:pt-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF7A00] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs">
            PM
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1E1E1E]">
            PM OS
          </span>
        </div>
        <p className="text-xs font-medium text-[#6B7280] tracking-wide uppercase">
          Product Management Operating System
        </p>
      </header>

      {/* Main Workspace Entrance Center Container */}
      <main className="w-full max-w-md my-auto py-8 sm:py-10 animate-fade-in">
        {children}
      </main>

      {/* Subtle Bottom Motto */}
      <footer className="w-full max-w-md text-center text-xs text-[#9CA3AF] tracking-wide font-medium py-4 select-none">
        Build Products. Build Yourself.
      </footer>
    </div>
  );
};
