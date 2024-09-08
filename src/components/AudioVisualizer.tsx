import React, { useRef, useEffect } from "react";
import useAudioVisualizer from "../hooks/useAudioVisualizer";

interface AudioVisualizerProps {
  mediaStream: MediaStream | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ mediaStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getWaveformData } = useAudioVisualizer(mediaStream);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const renderFrame = () => {
      if (!canvas || !context) return;

      const waveform = getWaveformData();
      if (waveform) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.strokeStyle = "lime";

        context.beginPath();
        const sliceWidth = (canvas.width * 1.0) / waveform.length;
        let x = 0;

        for (let i = 0; i < waveform.length; i++) {
          const v = waveform[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }

          x += sliceWidth;
        }

        context.lineTo(canvas.width, canvas.height / 2);
        context.stroke();
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [getWaveformData]);

  return <canvas ref={canvasRef} width={500} height={75}></canvas>;
};

export default AudioVisualizer;
