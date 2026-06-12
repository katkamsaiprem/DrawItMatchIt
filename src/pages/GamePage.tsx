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

    // ref to call canvas methods like toggleMode, undo, clear, download from here
    const canvasRef = useRef<CanvasHandle>(null);

    // Toolbar state lives here so we can render Toolbar anywhere in the layout
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
            <main className="flex flex-1 gap-4 p-4 overflow-hidden">


                <div className="relative flex-1 min-w-0">
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
        </div>
    )
}
export default GamePage;