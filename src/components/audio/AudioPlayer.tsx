import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AudioPlayerProps {
  audioUrl: string;
  durationMs: number;
  onReset?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, durationMs, onReset }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTimeMs(audio.currentTime * 1000);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTimeMs(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3DA] rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <audio ref={audioRef} src={audioUrl} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#8C827A]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Recorded Take Review
          </span>
        </div>
        <span className="font-mono text-xs text-[#57534E]">
          {formatTime(currentTimeMs)} / {formatTime(durationMs)}
        </span>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2 bg-[#F5F1EB] rounded-full overflow-hidden cursor-pointer relative"
        onClick={(e) => {
          if (!audioRef.current || durationMs <= 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          audioRef.current.currentTime = (clickPos * durationMs) / 1000;
        }}
      >
        <div
          className="h-full bg-[#1C1917] transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={togglePlay} className="w-24">
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play
              </>
            )}
          </Button>

          {onReset && (
            <Button size="sm" variant="outline" onClick={onReset} className="gap-1.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </Button>
          )}
        </div>

        <span className="text-[11px] text-[#8C827A]">Cached in IndexedDB</span>
      </div>
    </div>
  );
};
