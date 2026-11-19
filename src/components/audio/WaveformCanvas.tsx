import React, { useRef, useEffect } from 'react';

interface WaveformCanvasProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  className?: string;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  analyserNode,
  isActive,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina High-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const width = rect.width;
      const height = rect.height;
      const midY = height / 2;

      phaseRef.current += 0.04;

      if (!isActive || !analyserNode) {
        // Idle / Resting State: A subtle breathing horizontal hairline
        const breathingOffset = Math.sin(phaseRef.current) * 1.5;
        ctx.beginPath();
        ctx.strokeStyle = '#D1C9BE';
        ctx.lineWidth = 1;
        ctx.moveTo(0, midY + breathingOffset);
        ctx.lineTo(width, midY + breathingOffset);
        ctx.stroke();

        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Active State: Smooth continuous acoustic spline
      analyserNode.getByteTimeDomainData(dataArray);

      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#1C1917';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sliceWidth = width / (bufferLength - 1);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0.0 to 2.0 (1.0 is center)
        const displacement = (v - 1.0) * (height * 0.45);
        const y = midY + displacement;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Spline smoothing via quadratic curve
          const prevX = (i - 1) * sliceWidth;
          const prevY = midY + ((dataArray[i - 1] / 128.0) - 1.0) * (height * 0.45);
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, midY);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserNode, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-24 sm:h-32 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] ${className}`}
    />
  );
};
