import { useState, useCallback } from 'react';

export type UploadState =
  | 'idle'
  | 'requesting_url'
  | 'uploading'
  | 'confirming'
  | 'completed'
  | 'error';

export interface UploadProgress {
  state: UploadState;
  progressPercent: number;
  r2Key: string | null;
  playbackUrl: string | null;
  errorMessage: string | null;
}

export function useAudioUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    state: 'idle',
    progressPercent: 0,
    r2Key: null,
    playbackUrl: null,
    errorMessage: null,
  });

  const uploadAudio = useCallback(async (sessionId: string, audioBlob: Blob): Promise<boolean> => {
    try {
      setProgress({
        state: 'requesting_url',
        progressPercent: 10,
        r2Key: null,
        playbackUrl: null,
        errorMessage: null,
      });

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      // 1. Request presigned upload URL
      const presignedRes = await fetch(`${apiBase}/api/v1/audio/presigned-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          mime_type: audioBlob.type || 'audio/webm;codecs=opus',
          file_size_bytes: audioBlob.size,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error(`Failed to obtain upload URL (${presignedRes.status})`);
      }

      const { upload_url, r2_key } = await presignedRes.json();

      // 2. Direct PUT to Cloudflare R2 (or mock URL)
      setProgress({
        state: 'uploading',
        progressPercent: 20,
        r2Key: r2_key,
        playbackUrl: null,
        errorMessage: null,
      });

      // Handle mock upload gracefully if running offline test mock
      if (upload_url.includes('mock-r2.local')) {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate edge latency
        setProgress((prev) => ({ ...prev, progressPercent: 85 }));
      } else {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', upload_url);
          xhr.setRequestHeader('Content-Type', audioBlob.type || 'audio/webm;codecs=opus');

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round(20 + (e.loaded / e.total) * 65);
              setProgress((prev) => ({ ...prev, progressPercent: pct }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Edge storage rejected upload with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during R2 audio upload'));
          xhr.send(audioBlob);
        });
      }

      // 3. Confirm upload in database
      setProgress((prev) => ({
        ...prev,
        state: 'confirming',
        progressPercent: 90,
      }));

      const confirmRes = await fetch(`${apiBase}/api/v1/audio/confirm-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          r2_key,
          file_size_bytes: audioBlob.size,
          mime_type: audioBlob.type || 'audio/webm;codecs=opus',
        }),
      });

      if (!confirmRes.ok) {
        throw new Error(`Database confirmation failed (${confirmRes.status})`);
      }

      const confirmData = await confirmRes.json();

      setProgress({
        state: 'completed',
        progressPercent: 100,
        r2Key: r2_key,
        playbackUrl: confirmData.playback_url,
        errorMessage: null,
      });

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown upload failure';
      setProgress({
        state: 'error',
        progressPercent: 0,
        r2Key: null,
        playbackUrl: null,
        errorMessage: msg,
      });
      return false;
    }
  }, []);

  const resetUpload = useCallback(() => {
    setProgress({
      state: 'idle',
      progressPercent: 0,
      r2Key: null,
      playbackUrl: null,
      errorMessage: null,
    });
  }, []);

  return {
    ...progress,
    uploadAudio,
    resetUpload,
  };
}
