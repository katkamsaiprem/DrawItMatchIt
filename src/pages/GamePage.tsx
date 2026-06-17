import NavBar from "@/components/ui/NavBar";
import CanvasComponent, { type CanvasHandle } from "@/components/canvas/DrawingCanvas";
import Toolbar from "@/components/canvas/Toolbar";
import Countdown from "@/components/game/Countdown";
import RoomSidebar from "@/components/game/RoomSidebar";
import ReferenceImage from "@/components/game/ReferenceImage";
import { useAppStore } from "@/store/useAppStore";
import { useLobbyPlayers, useLobbyStatus } from "@/hooks/TanstackQuery/useGameQueries";
import { useLobbyRealtime } from "@/hooks/TanstackQuery/useLobbyRealtime";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";



/**
 * GamePage component is the main game screen where players can draw and match the reference image.
 * It contains the following components:
 *  NavBar: Displays the navigation bar with the game title and countdown timer.
 *  CanvasComponent: The canvas component where players can draw the reference image.
 *  Toolbar: The toolbar component for the canvas.
 *  Countdown: The countdown timer component.
 *  RoomSidebar: The room sidebar component to display the players in the lobby.
 *  ReferenceImage: The reference image component to display the reference image.
 */
const GamePage = () => {
    const { lobbyId, playerId } = useAppStore();
    const navigate = useNavigate();

    // We use this ref so we can talk to the canvas (undo, clear, etc.) from outside it.
    const canvasRef = useRef<CanvasHandle>(null);

    // Brush settings live here so both the desktop and mobile toolbars share the same values.
    const [lineSize, setLineSize] = useState(5);
    const [lineColor, setLineColor] = useState("#000000");
    const [mode, setMode] = useState<"draw" | "erase">("draw");
    const [isTimeUp, setTimeUp] = useState(false);

    useLobbyRealtime(lobbyId);
    const { data: players = [] } = useLobbyPlayers(lobbyId);
    const { data: lobby } = useLobbyStatus(lobbyId);

    useEffect(() => {
        if (players.length > 0) {
            const allFinished = players.every(p => p.status === "finished");
            if (allFinished) navigate("/results");
        }
    }, [players, navigate]);


    const handleToggleMode = () => {
        canvasRef.current?.toggleMode();
        setMode(prev => prev === "draw" ? "erase" : "draw");
    };
    const handleUndo = () => canvasRef.current?.undo();
    const handleClear = () => canvasRef.current?.clear();
    const handleDownload = () => canvasRef.current?.download();

    return (
        <div className="flex flex-col h-screen">
            <NavBar
                subtitle="Draw the target as closely as you can!"
                rightSlot={<Countdown minutes={1} startedAt={lobby?.startedAt} onTimeUp={() => setTimeUp(true)} />}
            />

            {/* On mobile, show a small scrollable row of player names at the top */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto px-3 py-2 border-b bg-background shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap pr-1">Players</span>
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={[
                            "flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs whitespace-nowrap shrink-0",
                            player.id === playerId ? "border-primary/40 bg-primary/5 font-bold" : "font-medium text-muted-foreground",
                        ].join(" ")}
                    >
                        <span>{player.name}{player.id === playerId ? " (You)" : ""}</span>
                        <span className={[
                            "text-[10px]",
                            player.status === "finished" ? "text-emerald-600" : "text-muted-foreground",
                        ].join(" ")}>
                            {player.status === "finished" ? "✓" : player.status === "drawing" ? "✏️" : "…"}
                        </span>
                    </div>
                ))}
            </div>

            <main className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

                <div className="relative flex-1 min-w-0 flex flex-col">
                    {lobby?.referenceImageId && (
                        <ReferenceImage imageId={lobby.referenceImageId} />
                    )}
                    <CanvasComponent
                        ref={canvasRef}
                        isTimeUp={isTimeUp}
                        lineSize={lineSize}
                        lineColor={lineColor}
                    />
                </div>

                {/* On desktop, show the full players list and toolbar on the right side */}
                <div className="hidden md:flex md:flex-col w-56 flex-shrink-0 gap-4">
                    <RoomSidebar players={players} selfPlayerId={playerId ?? ""} />
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
                </div>

            </main>

            {/* On mobile, show the toolbar pinned to the bottom of the screen */}
            <div className="md:hidden shrink-0 border-t bg-white px-3 py-2">
                {/* Action buttons: draw, erase, undo, clear, download */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            title="Draw"
                            onClick={() => mode === "erase" && handleToggleMode()}
                            className={[
                                "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all",
                                mode === "draw"
                                    ? "border-foreground bg-foreground/10 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]"
                                    : "border-foreground/20 bg-white",
                            ].join(" ")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            title="Erase"
                            onClick={() => mode === "draw" && handleToggleMode()}
                            className={[
                                "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all",
                                mode === "erase"
                                    ? "border-foreground bg-foreground/10 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]"
                                    : "border-foreground/20 bg-white",
                            ].join(" ")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                <path d="M22 21H7" />
                                <path d="m5 11 9 9" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            title="Undo"
                            onClick={handleUndo}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 14 4 9l5-5" />
                                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            title="Clear"
                            onClick={handleClear}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            title="Download"
                            onClick={handleDownload}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-foreground/20 bg-white transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </button>
                    </div>

                    {/* Color picker  scroll sideways if needed */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {["#000000", "#9ca3af", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#a855f7"].map((color) => (
                            <button
                                key={color}
                                type="button"
                                title={color}
                                onClick={() => setLineColor(color)}
                                style={{ backgroundColor: color }}
                                className={[
                                    "h-6 w-6 shrink-0 rounded-md border border-black/10 transition-all",
                                    lineColor === color ? "ring-2 ring-offset-1 ring-foreground scale-110" : "",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                </div>

                {/* Brush size dots */}
                <div className="flex items-center gap-3 mt-2 px-1">
                    {[4, 8, 14, 20].map((s) => (
                        <button
                            key={s}
                            type="button"
                            title={`Size ${s}`}
                            onClick={() => setLineSize(s)}
                            className={[
                                "rounded-full bg-foreground transition-all",
                                lineSize === s ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-30",
                            ].join(" ")}
                            style={{ width: s + 4, height: s + 4 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default GamePage;