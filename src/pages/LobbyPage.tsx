import { appwriteDb } from "@/appwrite-services/AppwriteTablesDB"
import LobbyHeader from "@/components/lobby/LobbyHeader"
import PlayerList from "@/components/lobby/PlayerList"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar"
import type { LobbyPlayer } from "@/types/game"
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
    const [players, setPlayers] = useState<LobbyPlayer[]>([]);

    const lobbyId = localStorage.getItem("lobbyId");
    const playerId = localStorage.getItem("playerId");

    useEffect(() => {
        if (playerId) setSelfId(playerId);
        const storedCode = localStorage.getItem("lobbyCode");
        if (storedCode) setLobbyCode(storedCode);


        const loadPlayers = async () => {
            if (!lobbyId) return;
            const result = await appwriteDb.getLobbyPlayers(lobbyId);
            const mapped = result.rows.map((row: any) => ({
                id: row.$id,
                name: row.name,
                isHost: row.isHost,
                isReady: row.isReady,
                avatarURL: row.avatarURL,
                status: row.status,
                statusText: row.statusText,
            }));
            setPlayers(mapped)

        }
        void loadPlayers();


    }, [lobbyId, playerId]) // loaded LobbyPlayers data

    const handleStartGame = async () => {
        if (!lobbyId) return;
        await appwriteDb.startGame(lobbyId);
        navigate("/gamePlay");
    }


    const currentPlayer = players.find((player) => player.id === selfId)
    const readyCount = players.filter((player) => player.isReady).length
    const canStart = Boolean(currentPlayer?.isHost && readyCount >= 2)

    const handleToggleReady = async () => {
        if (!selfId || !currentPlayer) return;
        await appwriteDb.toggleReady(selfId, !currentPlayer.isReady)//updates db

        //update client
        if (lobbyId) {
            const result = await appwriteDb.getLobbyPlayers(lobbyId);
            const mapped = result.rows.map((row: any) => ({
                id: row.$id,
                name: row.name,
                isReady: row.isReady,
                isHost: row.isHost,
                avatarURL: row.avatarURL,
                status: row.status,
                statusText: row.statusText,
            }));
            setPlayers(mapped);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/50">
            <NavBar subtitle="Invite players, get ready, then start." />

            <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
                <LobbyHeader lobbyCode={lobbyCode || "------"} isHost={Boolean(currentPlayer?.isHost)} />

                <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-3">
                        <PlayerList players={players} selfPlayerId={selfId ?? ""} />
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