import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

type LobbyHeaderProps = {
  lobbyCode: string
  isHost: boolean
}

function LobbyHeader({ lobbyCode, isHost }: LobbyHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Lobby</span>
          <span className="rounded-md border px-2 py-1 text-xs tracking-widest">{lobbyCode}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" type="button">
          Copy code
        </Button>
        <Button variant="outline" type="button">
          Leave lobby
        </Button>
        {isHost ? <p className="text-sm text-muted-foreground sm:ml-auto">You are the host.</p> : null}
      </CardContent>
    </Card>
  )
}

export default LobbyHeader
