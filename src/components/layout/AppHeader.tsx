import React from 'react';
import { useSessionStore, type PracticeMode } from '../../store/useSessionStore';
import { useAudioStore } from '../../store/useAudioStore';
import { Badge } from '../ui/Badge';
import { Mic, Sparkles, MessageSquare, Presentation, BookOpen } from 'lucide-react';

interface AppHeaderProps {
  onNavigateHome?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigateHome }) => {
  const { currentMode, setMode } = useSessionStore();
  const { state: recordingState } = useAudioStore();

  const modes: { id: PracticeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'interview', label: 'Interview', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'impromptu', label: 'Impromptu', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'presentation', label: 'Presentation', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'vocab', label: 'Vocabulary', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#E8E3DA]/80">
      {/* Brand */}
      <button
        onClick={onNavigateHome}
        className="flex items-baseline gap-1.5 text-left select-none cursor-pointer group bg-transparent border-none p-0"
      >
        <span className="font-serif text-2xl font-normal text-[#1C1917] tracking-tight group-hover:text-[#44403C] transition-colors">
          SpeakFluent
        </span>
        <span className="text-[10px] font-sans font-semibold text-[#8C827A] tracking-wider uppercase">
          tech
        </span>
      </button>

      {/* Mode Selector Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-[#F5F1EB] p-1 rounded-full border border-[#E8E3DA]">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer ${
                isActive
                  ? 'bg-[#1C1917] text-[#FAF8F5] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E8E3DA]/50'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System / Studio Status Indicator */}
      <div className="flex items-center gap-3">
        {recordingState === 'recording' ? (
          <Badge variant="critical" size="sm" className="animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#881337] animate-ping" />
            Live Recording
          </Badge>
        ) : recordingState === 'analyzing' ? (
          <Badge variant="warning" size="sm">
            Deliberating...
          </Badge>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#8C827A]">
            <Mic className="w-3.5 h-3.5 text-[#1E3A2F]" />
            <span className="font-medium">Studio Ready</span>
          </div>
        )}
      </div>
    </header>
  );
};
