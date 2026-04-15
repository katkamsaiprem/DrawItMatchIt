import type { LobbyPlayer } from "@/types/game"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

type PlayerListProps = {
  players: LobbyPlayer[]
  selfPlayerId: string
}

function PlayerList({ players, selfPlayerId }: PlayerListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {players.map((player) => {
          const isSelf = player.id === selfPlayerId

          return (
            <div key={player.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{player.name}</span>
                {isSelf ? <span className="text-xs text-muted-foreground">(you)</span> : null}
                {player.isHost ? <span className="text-xs text-muted-foreground">host</span> : null}
              </div>
              <span className={player.isReady ? "text-xs text-green-600" : "text-xs text-muted-foreground"}>
                {player.isReady ? "Ready" : "Waiting"}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default PlayerList
