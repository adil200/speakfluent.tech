import { create } from 'zustand';

export type RecordingState = 'idle' | 'countdown' | 'recording' | 'paused' | 'analyzing' | 'completed';

interface AudioState {
  state: RecordingState;
  durationMs: number;
  liveWpm: number;
  liveFillerCount: number;
  setState: (state: RecordingState) => void;
  updateMetrics: (wpm: number, fillerCount: number, durationMs: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  state: 'idle',
  durationMs: 0,
  liveWpm: 0,
  liveFillerCount: 0,
  setState: (state) => set({ state }),
  updateMetrics: (liveWpm, liveFillerCount, durationMs) =>
    set({ liveWpm, liveFillerCount, durationMs }),
  reset: () =>
    set({ state: 'idle', durationMs: 0, liveWpm: 0, liveFillerCount: 0 }),
}));
