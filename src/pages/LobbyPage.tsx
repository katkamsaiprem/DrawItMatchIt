
import LobbyHeader from "@/components/lobby/LobbyHeader"
import PlayerList from "@/components/lobby/PlayerList"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar"
import { useLeaveLobby, useLobbyPlayers, useLobbyStatus, useStartGame, useToggleReady } from "@/hooks/TanstackQuery/useGameQueries"
import { useLobbyRealtime } from "@/hooks/TanstackQuery/useLobbyRealtime"
import { useAppStore } from "@/store/useAppStore"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


const LobbyPage = () => {
    //load real players from TablesDB ,toggle ready then start the game

    const navigate = useNavigate();
    const { lobbyId, playerId, lobbyCode } = useAppStore();

    //TanstackQuery hooks
    const { data: players = [], isLoading } = useLobbyPlayers(lobbyId);
    const toggleReady = useToggleReady(lobbyId)
    const startGame = useStartGame()
    const leaveLobby = useLeaveLobby()
    //---------------

    // Realtime subscription — invalidates player & lobby queries on changes
    useLobbyRealtime(lobbyId)

    //host clicks "start game "all players should navigate to /gameplay
    const { data: lobbyStatus } = useLobbyStatus(lobbyId);

    useEffect(() => {
        if (lobbyStatus?.status === "in_progress" && lobbyId) {
            navigate("/gamePlay");
        }
    }, [lobbyStatus?.status, navigate, lobbyId])

    //------------

    const handleStartGame = async () => {
        if (!lobbyId) return;
        await startGame.mutateAsync(lobbyId);
        navigate("/gamePlay");
    }

    const handleLeaveLobby = async () => {
        if (!playerId || !lobbyId) return;
        await leaveLobby.mutateAsync({ playerId, lobbyId });
        navigate("/");
    }

    const currentPlayer = players.find((player) => player.id === playerId)
    const readyCount = players.filter((player) => player.isReady).length
    const canStart = Boolean(currentPlayer?.isHost && readyCount >= 1)

    const handleToggleReady = async () => {
        if (!playerId || !currentPlayer) return;
        toggleReady.mutate({ playerId, isReady: !currentPlayer.isReady });
    };


    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/50">
            <NavBar subtitle="Invite players, get ready, then start." />

            <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
                <LobbyHeader lobbyCode={lobbyCode || "------"} isHost={Boolean(currentPlayer?.isHost)} onLeave={handleLeaveLobby} />

                <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-3">
                        {isLoading
                            ? <p className="text-muted-foreground">Loading players</p>

                            : <PlayerList players={players} selfPlayerId={playerId ?? ""} />
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
