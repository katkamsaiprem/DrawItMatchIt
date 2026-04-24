//the canvas elements + all mouse and touch events
import type { MouseEvent } from 'react';
import useCanvas, { useMouseDownHandler, useMouseMoveHandler } from '@/hooks/useCanvas';

const CanvasComponent = () => {
  const { canvasRef, ctxRef, isDrawing } = useCanvas();

  const getMousePosition = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={4000}
      height={3000}
      onMouseDown={(e) => {
        if (!ctxRef.current) return;
        useMouseDownHandler(e, isDrawing, ctxRef.current, getMousePosition);
      }}
      onMouseMove={(e) => {
        if (!ctxRef.current) return;
        useMouseMoveHandler(e, isDrawing, ctxRef.current, getMousePosition);
      }}
    />
  );
};

export default CanvasComponent;
