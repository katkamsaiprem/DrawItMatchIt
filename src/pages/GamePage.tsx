// import PlayerList from "@/components/lobby/PlayerList";
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
        <div>
            <NavBar
                subtitle="Invite players, get ready, then start."

                rightSlot={<Countdown minutes={0} onTimeUp={() => setTimeUp(true)} />}
            />
            <main className="flex gap-4">

                <CanvasComponent isTimeUp={isTimeUp} />
                {lobby?.referenceImageId && (
                    <ReferenceImage imageId={lobby.referenceImageId} />
                )}
                <div className="m-3">
                    <RoomSidebar players={players} selfPlayerId={playerId ?? ""} />
                    {/* <PlayerList players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} /> */}
                </div>
            </main>
        </div>
    )
}
export default GamePage;