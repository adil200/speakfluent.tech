import React, { useState } from 'react';
import { useSessionStore } from '../../store/useSessionStore';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useLiveASR } from '../../hooks/useLiveASR';
import { WaveformCanvas } from './WaveformCanvas';
import { AudioPlayer } from './AudioPlayer';
import { LiveTranscriptViewer } from './LiveTranscriptViewer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Mic, Square, Pause, Play, AlertCircle, Sparkles } from 'lucide-react';

export const RecordingStudio: React.FC = () => {
  const { currentMode, activeSessionId, startSession } = useSessionStore();
  const [sessionId] = useState(() => activeSessionId || `session_${Date.now()}`);

  const liveASR = useLiveASR();

  const {
    recordingState,
    durationMs,
    audioUrl,
    analyserNode,
    errorMessage,
    startCountdown,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder(sessionId, {
    onAudioChunk: liveASR.sendAudioChunk,
  });

  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handleStart = async () => {
    setValidationWarning(null);
    liveASR.clearTranscript();
    await liveASR.connect();
    if (!activeSessionId) startSession(sessionId);
    startCountdown();
  };

  const handleStop = async () => {
    liveASR.disconnect();
    const blob = await stopRecording();
    if (blob && durationMs < 5000) {
      setValidationWarning('Take is under 5 seconds (Rule BR-07). Speech analytics require a longer response.');
    }
  };

  const handleReset = () => {
    liveASR.clearTranscript();
    resetRecording();
  };

  const formatTimer = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Studio Banner */}
      <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-[#8C827A] tracking-wider">
            Practice Cockpit
          </span>
          <h2 className="font-serif text-2xl text-[#1C1917] capitalize mt-0.5">
            {currentMode} Mode Studio
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {recordingState === 'recording' && (
            <Badge variant="critical" size="sm" className="animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#881337] animate-ping" />
              Recording Active
            </Badge>
          )}
          {recordingState === 'paused' && (
            <Badge variant="warning" size="sm">
              Paused
            </Badge>
          )}
          {recordingState === 'completed' && (
            <Badge variant="optimal" size="sm">
              Take Captured
            </Badge>
          )}
          {recordingState === 'idle' && (
            <Badge variant="neutral" size="sm">
              Standby
            </Badge>
          )}
        </div>
      </div>

      {/* Error or Validation Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] text-[#881337] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {validationWarning && (
        <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Waveform Visualization Canvas */}
      <div className="relative flex flex-col gap-2">
        <WaveformCanvas
          analyserNode={analyserNode}
          isActive={recordingState === 'recording'}
        />

        {/* Live Timer Float */}
        {(recordingState === 'recording' || recordingState === 'paused') && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-[#E8E3DA] px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#1C1917] shadow-xs">
            {formatTimer(durationMs)}
          </div>
        )}
      </div>

      {/* Live Verbatim Transcription Display */}
      <LiveTranscriptViewer
        transcript={liveASR.transcriptText}
        words={liveASR.words}
        isRecording={recordingState === 'recording'}
      />

      {/* Interactive Controls & States */}
      <div className="flex flex-col items-center justify-center gap-4 py-2">
        {recordingState === 'idle' && (
          <Button size="lg" variant="primary" onClick={handleStart} className="gap-2.5 px-8">
            <Mic className="w-5 h-5 text-[#FAF8F5]" />
            <span>Begin Recording Take</span>
          </Button>
        )}

        {recordingState === 'countdown' && (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <span className="font-serif text-4xl text-[#1C1917]">Take a breath...</span>
            <span className="text-xs text-[#8C827A]">Microphone calibrating</span>
          </div>
        )}

        {(recordingState === 'recording' || recordingState === 'paused') && (
          <div className="flex items-center gap-4">
            {recordingState === 'recording' ? (
              <Button size="md" variant="outline" onClick={pauseRecording} className="gap-2">
                <Pause className="w-4 h-4" /> Pause
              </Button>
            ) : (
              <Button size="md" variant="outline" onClick={resumeRecording} className="gap-2">
                <Play className="w-4 h-4" /> Resume
              </Button>
            )}

            <Button size="md" variant="danger" onClick={handleStop} className="gap-2">
              <Square className="w-4 h-4 fill-current" /> Finish Recording
            </Button>
          </div>
        )}

        {recordingState === 'completed' && audioUrl && (
          <div className="w-full flex flex-col gap-4">
            <AudioPlayer audioUrl={audioUrl} durationMs={durationMs} onReset={handleReset} />

            <div className="flex items-center justify-end gap-3 mt-2">
              <Button size="md" variant="outline" onClick={handleReset}>
                Record Another Take
              </Button>

              <Button
                size="md"
                variant="primary"
                disabled={durationMs < 5000}
                className="gap-2"
                onClick={() => {
                  alert('Ready for Phase 5: Cloudflare Edge Storage & Multi-Agent Deliberation Pipeline!');
                }}
              >
                <span>Submit to AI Coach</span>
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
