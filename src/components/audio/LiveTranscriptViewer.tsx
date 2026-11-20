import React from 'react';
import { type WordToken } from '../../hooks/useLiveASR';

interface LiveTranscriptViewerProps {
  transcript: string;
  words: WordToken[];
  isRecording: boolean;
}

export const LiveTranscriptViewer: React.FC<LiveTranscriptViewerProps> = ({
  transcript,
  words,
  isRecording,
}) => {
  if (!transcript && words.length === 0 && !isRecording) {
    return null;
  }

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3DA] rounded-xl p-5 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#E8E3DA]/80 pb-2">
        <span className="text-xs uppercase font-semibold text-[#8C827A] tracking-wider">
          Live Verbatim Transcription (Deepgram Nova-3)
        </span>
        {isRecording && (
          <span className="text-[11px] text-[#1E3A2F] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F] animate-pulse" />
            Listening for Fillers
          </span>
        )}
      </div>

      <div className="font-serif text-lg text-[#1C1917] leading-relaxed min-h-12 select-text">
        {words.length > 0 ? (
          words.map((w, idx) => {
            if (w.is_filler) {
              return (
                <span
                  key={`${w.word}-${w.start}-${idx}`}
                  title={`Hesitation Filler: ${w.word} (${w.start.toFixed(1)}s)`}
                  className="inline-block mx-0.5 px-1.5 py-0.5 rounded bg-[#FFE4E6] text-[#881337] border border-[#FECDD3] font-sans text-sm font-semibold tracking-wide"
                >
                  {w.word}
                </span>
              );
            }
            return <span key={`${w.word}-${w.start}-${idx}`}> {w.word}</span>;
          })
        ) : (
          <span className="text-sm font-sans text-[#8C827A] italic">
            {isRecording ? 'Speak clearly into your microphone...' : 'No transcription captured.'}
          </span>
        )}
      </div>
    </div>
  );
};
