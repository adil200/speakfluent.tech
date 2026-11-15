import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface SpeakFluentDB extends DBSchema {
  audio_recordings: {
    key: string; // sessionId
    value: {
      sessionId: string;
      blob: Blob;
      mimeType: string;
      durationMs: number;
      createdAt: number;
    };
  };
}

const DB_NAME = 'speakfluent_local_vault';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SpeakFluentDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SpeakFluentDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('audio_recordings')) {
          db.createObjectStore('audio_recordings', { keyPath: 'sessionId' });
        }
      },
    });
  }
  return dbPromise;
}

export const audioStorage = {
  async saveRecording(sessionId: string, blob: Blob, durationMs: number): Promise<void> {
    const db = await getDB();
    await db.put('audio_recordings', {
      sessionId,
      blob,
      mimeType: blob.type,
      durationMs,
      createdAt: Date.now(),
    });
  },

  async getRecording(sessionId: string): Promise<Blob | null> {
    const db = await getDB();
    const record = await db.get('audio_recordings', sessionId);
    return record ? record.blob : null;
  },

  async deleteRecording(sessionId: string): Promise<void> {
    const db = await getDB();
    await db.delete('audio_recordings', sessionId);
  },
};
