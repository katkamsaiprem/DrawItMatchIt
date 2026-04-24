//custom hook contains logic related to context, drawing logic ,getPosition

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";

type Position = { x: number; y: number };

const useCanvas = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const getPosition = (e: MouseEvent<HTMLCanvasElement>): Position => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return { x: 0, y: 0 };
        }

        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return
        }

        ctxRef.current = context;

       
    }, []); 

    return { canvasRef, isDrawing, ctxRef, getPosition };

}
export const useMouseDownHandler = (
    e: MouseEvent<HTMLCanvasElement>,
    isDrawing: RefObject<boolean>,
    ctx: CanvasRenderingContext2D | null,
    getPosition: (e: MouseEvent<HTMLCanvasElement>) => Position
) => {
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getPosition(e);  // correct position
    ctx.beginPath();
    ctx.moveTo(x, y);
}
export const useMouseMoveHandler = (
    e: MouseEvent<HTMLCanvasElement>,
    isDrawing: RefObject<boolean>,
    ctx: CanvasRenderingContext2D | null,
    getPosition: (e: MouseEvent<HTMLCanvasElement>) => Position
) => {
    if (!ctx || !isDrawing.current) return;
    const { x, y } = getPosition(e);  //  correct position
    ctx.lineTo(x, y);
    ctx.stroke();
}
export default useCanvas;