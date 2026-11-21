import React from 'react';
import { type UploadState } from '../../hooks/useAudioUpload';
import { CloudUpload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressBannerProps {
  state: UploadState;
  progressPercent: number;
  errorMessage: string | null;
}

export const UploadProgressBanner: React.FC<UploadProgressBannerProps> = ({
  state,
  progressPercent,
  errorMessage,
}) => {
  if (state === 'idle') return null;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E3DA] rounded-xl p-4 shadow-xs flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {state === 'requesting_url' && (
            <>
              <Loader2 className="w-4 h-4 text-[#8C827A] animate-spin" />
              <span className="text-xs font-semibold text-[#1C1917]">Contacting Cloudflare Edge...</span>
            </>
          )}
          {state === 'uploading' && (
            <>
              <CloudUpload className="w-4 h-4 text-[#1E3A2F] animate-pulse" />
              <span className="text-xs font-semibold text-[#1C1917]">Archiving Audio to Cloudflare R2...</span>
            </>
          )}
          {state === 'confirming' && (
            <>
              <Loader2 className="w-4 h-4 text-[#1E3A2F] animate-spin" />
              <span className="text-xs font-semibold text-[#1C1917]">Persisting Session Records...</span>
            </>
          )}
          {state === 'completed' && (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#1E3A2F]" />
              <span className="text-xs font-semibold text-[#1E3A2F]">Audio Safely Archival-Synced</span>
            </>
          )}
          {state === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-[#881337]" />
              <span className="text-xs font-semibold text-[#881337]">Storage Ingestion Interrupted</span>
            </>
          )}
        </div>

        <span className="text-xs font-mono font-semibold text-[#8C827A]">
          {state === 'error' ? '0%' : `${progressPercent}%`}
        </span>
      </div>

      {/* Progress Track */}
      {state !== 'error' ? (
        <div className="w-full bg-[#E8E3DA]/60 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#1E3A2F] h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : (
        <p className="text-xs text-[#881337] mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
