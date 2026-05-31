// import PlayerList from "@/components/lobby/PlayerList";
import NavBar from "@/components/ui/NavBar";


import CanvasComponent from "@/components/canvas/DrawingCanvas";
import Countdown from "@/components/game/Countdown";
import RoomSidebar from "@/components/game/RoomSidebar";
import { useAppStore } from "@/store/useAppStore";
import { useLobbyPlayers } from "@/hooks/TanstackQuery/useGameQueries";



const GamePage = () => {
    const { lobbyId, playerId } = useAppStore();
    const { data: players = [] } = useLobbyPlayers(lobbyId);

    return (
        <div>
            <NavBar
                subtitle="Invite players, get ready, then start."

                rightSlot={<Countdown minutes={0} />}
            />
            <main className="flex gap-4">
                <div className="flex-1">
                    <CanvasComponent />
                </div>
                <div className="m-3">
                    <RoomSidebar players={players} selfPlayerId={playerId ?? ""} />
                    {/* <PlayerList players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} /> */}
                </div>
            </main>
        </div>
    )
}
export default GamePage;