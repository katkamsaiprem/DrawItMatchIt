import LobbyHeader from "@/components/lobby/LobbyHeader"
import PlayerList from "@/components/lobby/PlayerList"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar"
import type { LobbyPlayer } from "@/types/game"

const PREVIEW_PLAYERS: LobbyPlayer[] = [
  { id: "p-1", name: "sai", isReady: true, isHost: true },
  { id: "p-2", name: "prem", isReady: true, isHost: false },
  { id: "p-3", name: "saiprem", isReady: false, isHost: false },
]
const PREVIEW_SELF_ID = "p-1"
const PREVIEW_CODE = "AB12CD"

const LobbyPage = () => {
    const currentPlayer = PREVIEW_PLAYERS.find((player) => player.id === PREVIEW_SELF_ID)
    const readyCount = PREVIEW_PLAYERS.filter((player) => player.isReady).length
    const canStart = Boolean(currentPlayer?.isHost && readyCount >= 2)

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/50">
            <NavBar subtitle="Invite players, get ready, then start." />

            <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
                <LobbyHeader lobbyCode={PREVIEW_CODE} isHost={Boolean(currentPlayer?.isHost)} />

                <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-3">
                        <PlayerList players={PREVIEW_PLAYERS} selfPlayerId={PREVIEW_SELF_ID} />
                    </div>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Ready check</CardTitle>
                            <CardDescription>{readyCount} / {PREVIEW_PLAYERS.length} ready</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="secondary" type="button">
                                {currentPlayer?.isReady ? "Set as not ready" : "Set as ready"}
                            </Button>

                            <Button className="w-full" disabled={!canStart}>
                                Start game
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default LobbyPage