// import CanvasComponent from "@/components/canvas/DrawingCanvas"
import PlayerList from "@/components/lobby/PlayerList";
import NavBar from "@/components/ui/NavBar";
import { PREVIEW_PLAYERS, PREVIEW_SELF_ID } from "./LobbyPage";
import CanvasComponent from "@/components/canvas/DrawingCanvas";
import Countdown from "@/components/game/Countdown";

// import { Progress } from "@/components/ui/progress"
// import { useState, useEffect } from "react";


const GamePage = () => {
    // const currentPlayer = PREVIEW_PLAYERS.find((player) => player.id === PREVIEW_SELF_ID)
    // const COUNTDOWN_MINUTES = 2
    // const totalSeconds = COUNTDOWN_MINUTES * 60
    // const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

    // const minutes = Math.floor(secondsLeft / 60)
    // const seconds = secondsLeft % 60
    // const label = `Timer :- ${minutes}:${seconds.toString().padStart(2, "0")}`

    // useEffect(() => {
    //     const id = window.setInterval(() => {
    //         setSecondsLeft((prev) => prev - 1)
    //     }, 1000)

    //     return () => window.clearInterval(id)
    // }, [])

    // const progressValue = (secondsLeft / totalSeconds) * 100
    return (
        <div>
            <NavBar
                subtitle="Invite players, get ready, then start."
                // rightSlot={
                //     <div className="flex w-32 flex-col gap-1">
                //         <div className="text-xs font-semibold tabular-nums">{label}</div>
                //         <Progress value={progressValue} />
                //     </div>
                // }
                rightSlot={<Countdown minutes={2} />}
            />
            <main className="flex gap-4">
                <div className="flex-1">
                    <CanvasComponent />
                </div>
                <div className="m-3">
                    <PlayerList players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} />
                </div>
            </main>
        </div>
    )
}
export default GamePage;