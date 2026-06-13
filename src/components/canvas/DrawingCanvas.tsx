import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { create } from "simple-drawing-board"
import { useAppStore } from "@/store/useAppStore";
import { useSubmitDrawings } from "@/hooks/TanstackQuery/useGameQueries";

type CanvasProps = {
  isTimeUp?: boolean;
  lineSize: number;
  lineColor: string;
}


export type CanvasHandle = {
  toggleMode: () => void;
  undo: () => void;
  clear: () => void;
  download: () => void;
  getMode: () => "draw" | "erase";
}

// forwardRef lets GamePage pass a ref={canvasRef} to this component
const CanvasComponent = forwardRef<CanvasHandle, CanvasProps>(
  ({ isTimeUp, lineSize, lineColor }, ref) => {

    const containerRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const boardRef = useRef<ReturnType<typeof create> | null>(null);

    const { lobbyId, playerId } = useAppStore();
    const submitDrawing = useSubmitDrawings();

    const applyStrokeStyle = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }


    useEffect(() => {
      if (!canvasRef.current) return;
      boardRef.current = create(canvasRef.current);
      boardRef.current.setLineColor("#000");
      boardRef.current.setLineSize(5);
      applyStrokeStyle(canvasRef.current)
      return () => boardRef.current?.destroy();
    }, []);


    useEffect(() => {
      if (!boardRef.current) return;
      boardRef.current.setLineColor(lineColor);
    }, [lineColor]);


    useEffect(() => {
      if (!boardRef.current) return;
      boardRef.current.setLineSize(lineSize);
    }, [lineSize]);


    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const board = boardRef.current;
      if (!container || !canvas || !board) return;

      const resizeToContainer = async () => {
        const dataUrl = board.toDataURL();
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        applyStrokeStyle(canvas)
        await board.fillImageByDataURL(dataUrl);
      };

      const observer = new ResizeObserver(() => { void resizeToContainer(); });
      observer.observe(container);
      void resizeToContainer();

      return () => observer.disconnect();
    }, []);

    const handleSubmit = async () => {
      if (!boardRef.current || !lobbyId || !playerId) return;
      const dataUrl = boardRef.current.toDataURL();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "drawing.png", { type: "image/png" });
      await submitDrawing.mutateAsync({ lobbyId, playerId, file });
    }

    useEffect(() => {
      if (isTimeUp) { handleSubmit() }
    }, [isTimeUp])

    // Expose these methods so GamePage can call them from canvasRef.current.toggleMode().
    useImperativeHandle(ref, () => ({
      toggleMode: () => { boardRef.current?.toggleMode(); },
      undo: async () => { await boardRef.current?.undo(); },
      clear: () => { boardRef.current?.clear(); },
      download: () => {
        const dataUrl = boardRef.current?.toDataURL();
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "drawing.png";
        a.click();
      },
      getMode: () => boardRef.current?.mode ?? "draw",
    }));

    return (
      <div ref={containerRef} className="w-full h-[70vh] border">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    );
  }
);

CanvasComponent.displayName = "CanvasComponent";
export default CanvasComponent;