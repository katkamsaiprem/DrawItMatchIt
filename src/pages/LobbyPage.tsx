
import LobbyHeader from "@/components/lobby/LobbyHeader"
import PlayerList from "@/components/lobby/PlayerList"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar"
import { useLobbyPlayers, useLobbyStatus, useStartGame, useToggleReady } from "@/hooks/TanstackQuery/useGameQueries"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


// export const PREVIEW_PLAYERS: LobbyPlayer[] = [
//     { id: "p-1", name: "sai", isReady: true, isHost: true },
//     { id: "p-2", name: "prem", isReady: true, isHost: false },
//     { id: "p-3", name: "saiprem", isReady: false, isHost: false },
// ]
// export const PREVIEW_SELF_ID = "p-1"
// const PREVIEW_CODE = "AB12CD"

const LobbyPage = () => {
    //load real players from TablesDB ,toggle ready then start the game

    const navigate = useNavigate();

    const [selfId, setSelfId] = useState<string | null>(null);
    const [lobbyCode, setLobbyCode] = useState<string>("");


    const lobbyId = localStorage.getItem("lobbyId");
    const playerId = localStorage.getItem("playerId");

    useEffect(() => {
        if (playerId) setSelfId(playerId);
        const storedCode = localStorage.getItem("lobbyCode");
        if (storedCode) setLobbyCode(storedCode);

    }, [playerId]) // loaded LobbyPlayers data

    //TanstackQuery hooks
    const { data: players = [], isLoading } = useLobbyPlayers(lobbyId);
    const toggleReady = useToggleReady(lobbyId)
    const startGame = useStartGame()
    //---------------

    useLobbyPlayers(lobbyId);

    //host clicks "start game "all players should navigate to /gameplay
    const { data: lobbyStatus } = useLobbyStatus(lobbyId);

    useEffect(() => {
        if (lobbyStatus?.status === "in_progress" && lobbyId) {
            navigate("/gamePlay");
        }
    }, [lobbyStatus?.status, navigate])

    //------------

    const handleStartGame = async () => {
        if (!lobbyId) return;
        await startGame.mutateAsync(lobbyId);
        navigate("/gamePlay");
    }


    const currentPlayer = players.find((player) => player.id === selfId)
    const readyCount = players.filter((player) => player.isReady).length
    const canStart = Boolean(currentPlayer?.isHost && readyCount >= 1)

    const handleToggleReady = async () => {
        if (!selfId || !currentPlayer) return;
        toggleReady.mutate({ playerId: selfId, isReady: !currentPlayer.isReady });
    };


    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/50">
            <NavBar subtitle="Invite players, get ready, then start." />

            <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
                <LobbyHeader lobbyCode={lobbyCode || "------"} isHost={Boolean(currentPlayer?.isHost)} />

                <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-3">
                        {isLoading
                            ? <p className="text - muted - foreground">Loading players</p>

                            : <PlayerList players={players} selfPlayerId={selfId ?? ""} />
                        }
                    </div>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Ready check</CardTitle>
                            <CardDescription>{readyCount} / {players.length} ready</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="secondary" type="button" onClick={handleToggleReady}>
                                {currentPlayer?.isReady ? "Set as not ready" : "Set as ready"}
                            </Button>

                            <Button className="w-full" disabled={!canStart} onClick={handleStartGame}>
                                Start Game
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default LobbyPage
