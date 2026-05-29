// import PlayerList from "@/components/lobby/PlayerList";
import NavBar from "@/components/ui/NavBar";

import { PREVIEW_PLAYERS, PREVIEW_SELF_ID } from "./LobbyPage";
import CanvasComponent from "@/components/canvas/DrawingCanvas";
import Countdown from "@/components/game/Countdown";
import RoomSidebar from "@/components/game/RoomSidebar";



const GamePage = () => {

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
                    <RoomSidebar players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} />
                    {/* <PlayerList players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} /> */}
                </div>
            </main>
        </div>
    )
}
export default GamePage;