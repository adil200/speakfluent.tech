import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioStore } from '../store/useAudioStore';

export interface WordToken {
  word: string;
  start: number;
  end: number;
  is_filler: boolean;
  confidence: number;
}

export interface UseLiveASRReturn {
  isConnected: boolean;
  transcriptText: string;
  words: WordToken[];
  connect: () => Promise<void>;
  sendAudioChunk: (chunk: Blob) => void;
  disconnect: () => void;
  clearTranscript: () => void;
}

export function useLiveASR(): UseLiveASRReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [words, setWords] = useState<WordToken[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const { updateMetrics } = useAudioStore();

  const connect = useCallback(async () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/audio-stream';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript_update') {
          if (data.text) {
            setTranscriptText(data.text);
          }
          if (data.words && data.words.length > 0) {
            setWords((prev) => [...prev, ...data.words]);
          }
          if (data.live_wpm !== undefined) {
            updateMetrics(data.live_wpm, data.live_filler_count || 0, 0);
          }
        }
      } catch (err) {
        console.error('Failed to parse ASR message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn('ASR WebSocket connection warning:', err);
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, [updateMetrics]);

  const sendAudioChunk = useCallback((chunk: Blob) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      chunk.arrayBuffer().then((buffer) => {
        wsRef.current?.send(buffer);
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'STOP' }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscriptText('');
    setWords([]);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    transcriptText,
    words,
    connect,
    sendAudioChunk,
    disconnect,
    clearTranscript,
  };
}
