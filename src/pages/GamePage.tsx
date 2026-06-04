import NavBar from "@/components/ui/NavBar";

import CanvasComponent from "@/components/canvas/DrawingCanvas";
import Countdown from "@/components/game/Countdown";
import RoomSidebar from "@/components/game/RoomSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useLobbyPlayers, useLobbyStatus } from "@/hooks/TanstackQuery/useGameQueries";
import { useLobbyRealtime } from "@/hooks/TanstackQuery/useLobbyRealtime";
import ReferenceImage from "@/components/game/ReferenceImage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



const GamePage = () => {
    const { lobbyId, playerId } = useAppStore();
    const navigate = useNavigate();

    const [isTimeUp, setTimeUp] = useState(false)

    useLobbyRealtime(lobbyId);

    const { data: players = [] } = useLobbyPlayers(lobbyId);
    const { data: lobby } = useLobbyStatus(lobbyId);


    useEffect(() => {
        if (players.length > 0) {
            const allFinished = players.every(p => p.status === "finished");
            if (allFinished) {
                navigate("/results");
            }
        }
    }, [players, navigate]);
    return (
        <div className="flex flex-col h-screen">
            <NavBar
                subtitle="Draw the target as closely as you can!"

                rightSlot={<Countdown minutes={1} startedAt={lobby?.startedAt} onTimeUp={() => setTimeUp(true)} />}
            />
            <main className="flex flex-1 gap-4 p-4 overflow-hidden">
                {/* Canvas area with reference image overlay */}
                <div className="relative flex-1 min-w-0">
                    {lobby?.referenceImageId && (
                        <ReferenceImage imageId={lobby.referenceImageId} />
                    )}
                    <CanvasComponent isTimeUp={isTimeUp} />
                </div>

                {/* Sidebar - hidden on mobile, shown on md+ */}
                <div className="hidden md:block flex-shrink-0">
                    <RoomSidebar players={players} selfPlayerId={playerId ?? ""} />
                </div>
            </main>
        </div>
    )
}
export default GamePage;