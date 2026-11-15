import React from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigateHome?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigateHome }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#FAF8F5] text-[#1C1917] font-sans">
      {/* Ambient Radial Warmth Vignette */}
      <div className="ambient-vignette" />

      {/* Header */}
      <AppHeader onNavigateHome={onNavigateHome} />

      {/* Main View Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
};
