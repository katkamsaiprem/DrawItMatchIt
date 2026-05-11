// //the canvas elements + all mouse and touch events
// import type { MouseEvent } from 'react';
// import useCanvas, { useMouseDownHandler, useMouseMoveHandler, useMouseUpHandler } from '@/hooks/useCanvas';

import { useEffect, useRef, useState } from "react"
import { create } from "simple-drawing-board"
import Toolbar from "@/components/canvas/Toolbar"

// const CanvasComponent = () => {
//   const { canvasRef, ctxRef, isDrawing } = useCanvas();

//   const getMousePosition = (e: MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };

//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       width={1400}
//       height={900}
//       onMouseDown={(e) => {
//         if (!ctxRef.current) return;
//         useMouseDownHandler(e, isDrawing, ctxRef.current, getMousePosition);
//       }}
//       onMouseMove={(e) => {
//         if (!ctxRef.current) return;
//         useMouseMoveHandler(e, isDrawing, ctxRef.current, getMousePosition);
//       }}
//       onMouseUp={() => {
//         if (!ctxRef.current) return;
//         useMouseUpHandler(isDrawing, ctxRef.current);
//       }}
//     />
//   );
// };

// export default CanvasComponent;

const CanvasComponent = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)//useRef is used to store values like dom elements which are no need to render , 
  const boardRef = useRef<ReturnType<typeof create> | null>(null);//stores the drawing board instance ,created by create() to get access to functions

  const [lineSize, setLineSize] = useState(5)
  const [lineColor, setLineColor] = useState("#000000")
  const [mode, setMode] = useState<"draw" | "erase">("draw")

  const applyStrokeStyle = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    
  }
  useEffect(() => {
    if (!canvasRef.current) return;//if canvas is not ready then return
    //now intialize the board on canvas
    boardRef.current = create(canvasRef.current);
    boardRef.current.setLineColor("#000");
    boardRef.current.setLineSize(5);//5 pixels
    applyStrokeStyle(canvasRef.current)
    //now we need to write cleanUP function to remove not req memory(memory leaks) , it runs when comp ,unmounts
    return () => boardRef.current?.destroy();
  }, []);

  //Whenever lineColor and lineSize changes ,then update board
  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.setLineColor(lineColor);
  }, [lineColor]);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.setLineSize(lineSize);
  }, [lineSize]);


  //Resize without losing the drawing
  /*
    first take snapshot of drawing before resizing the canvas
    Resize the canvas to match the container
    Restore the drawing afterward
   */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (!container || !canvas || !board) return;

    const resizeToContainer = async () => {
      const dataUrl = board.toDataURL(); // toDataURL converts drawing's data into URL form
      canvas.width = container.clientWidth;//Resize the canvas to match the container
      canvas.height = container.clientHeight;
      applyStrokeStyle(canvas)
      await board.fillImageByDataURL(dataUrl);//Restore the drawing afterward
    };

    const observer = new ResizeObserver(() => {//Observer runs whenever the container size changes
      void resizeToContainer();
    });

    observer.observe(container);//start observing + initialResize , resizeToContainer() is called once so the canvas matches the container on first render
    void resizeToContainer();

    return () => observer.disconnect();
  }, []);



  //Toolbar actions 


  const handleToggleMode = () => { //logic to change draw to eraser or eraser to draw
    if (!boardRef.current) return;
    boardRef.current.toggleMode();
    setMode(boardRef.current.mode);//updates the mode
  };

  const handleUndo = async () => {
    await boardRef.current?.undo()
  };


  const handleClear = () => {
    boardRef.current?.clear()
  };

  const handleDownload = () => {
    const dataUrl = boardRef.current?.toDataURL();//
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "drawing.png";
    a.click();
  };



  return (
    <div className="flex flex-col gap-3 w-full">
      <Toolbar
        lineSize={lineSize}
        lineColor={lineColor}
        mode={mode}
        onLineSizeChange={setLineSize}
        onLineColorChange={setLineColor}
        onToggleMode={handleToggleMode}
        onUndo={handleUndo}

        onClear={handleClear}
        onDownload={handleDownload}

      />
      <div ref={containerRef} className="w-full h-[70vh] border">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
};

export default CanvasComponent;