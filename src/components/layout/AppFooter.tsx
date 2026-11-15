import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export const AppFooter: React.FC = () => {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#E8E3DA]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C827A] gap-3">
      <div className="flex items-center gap-2">
        <span className="font-serif text-sm font-normal text-[#1C1917]">SpeakFluent</span>
        <span>•</span>
        <span>Acoustic Poise & Articulation Coach</span>
      </div>

      <div className="flex items-center gap-6">
        <span>Cloudflare Edge</span>
        <span>Deepgram Nova-3</span>
        <span>PostgreSQL & Redis</span>
        <span>© {CURRENT_YEAR}</span>
      </div>
    </footer>
  );
};
