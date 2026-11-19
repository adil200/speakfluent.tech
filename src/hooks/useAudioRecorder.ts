import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioStore } from '../store/useAudioStore';
import { audioStorage } from '../lib/storage/audioStorage';

export interface UseAudioRecorderReturn {
  recordingState: string;
  durationMs: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  analyserNode: AnalyserNode | null;
  errorMessage: string | null;
  startCountdown: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  resetRecording: () => void;
}

export function useAudioRecorder(sessionId: string): UseAudioRecorderReturn {
  const { state, setState } = useAudioStore();
  const [durationMs, setDurationMs] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const initAudio = useCallback(async (): Promise<boolean> => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      setAnalyserNode(analyser);

      // Select supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current = recorder;
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied';
      setErrorMessage(`Microphone error: ${msg}. Please allow microphone permissions.`);
      setState('idle');
      return false;
    }
  }, [setState]);

  const startActualRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    chunksRef.current = [];
    mediaRecorderRef.current.start(250); // Emit chunk every 250ms
    setState('recording');
    startTimeRef.current = Date.now();
    setDurationMs(0);

    timerRef.current = window.setInterval(() => {
      setDurationMs(Date.now() - startTimeRef.current);
    }, 100);
  }, [setState]);

  const startCountdown = useCallback(async () => {
    const success = await initAudio();
    if (!success) return;

    setState('countdown');
    let count = 3;
    const interval = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        startActualRecording();
      }
    }, 1000);
  }, [initAudio, startActualRecording, setState]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setState('paused');
    }
  }, [setState]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      const pausedDuration = durationMs;
      startTimeRef.current = Date.now() - pausedDuration;
      timerRef.current = window.setInterval(() => {
        setDurationMs(Date.now() - startTimeRef.current);
      }, 100);
      setState('recording');
    }
  }, [durationMs, setState]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      if (timerRef.current) clearInterval(timerRef.current);

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const finalBlob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(finalBlob);

        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);

        // Persist to IndexedDB
        await audioStorage.saveRecording(sessionId, finalBlob, durationMs);

        // Stop microphone tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        setState('completed');
        resolve(finalBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [sessionId, durationMs, setState]);

  const resetRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDurationMs(0);
    setErrorMessage(null);
    setAnalyserNode(null);
    setState('idle');
  }, [audioUrl, setState]);

  return {
    recordingState: state,
    durationMs,
    audioBlob,
    audioUrl,
    analyserNode,
    errorMessage,
    startCountdown,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  };
}
