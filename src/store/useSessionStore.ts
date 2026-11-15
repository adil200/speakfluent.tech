import { create } from 'zustand';

export type PracticeMode = 'interview' | 'impromptu' | 'presentation' | 'vocab';

interface SessionState {
  currentMode: PracticeMode;
  activeSessionId: string | null;
  setMode: (mode: PracticeMode) => void;
  startSession: (sessionId: string) => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentMode: 'interview',
  activeSessionId: null,
  setMode: (mode) => set({ currentMode: mode }),
  startSession: (sessionId) => set({ activeSessionId: sessionId }),
  endSession: () => set({ activeSessionId: null }),
}));
