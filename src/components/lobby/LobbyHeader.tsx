import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useState } from "react"


type LobbyHeaderProps = {
  lobbyCode: string
  isHost: boolean
  onLeave?: () => void
}


const LobbyHeader = ({ lobbyCode, isHost, onLeave }: LobbyHeaderProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)//reset copied state after 2 seconds
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Lobby</span>
          <span className="rounded-md border px-2 py-1 text-xs tracking-widest">{lobbyCode}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy code'}
        </Button>
        <Button variant="outline" type="button" onClick={onLeave}>
          Leave Lobby
        </Button>
        {isHost ? <p className="text-sm text-muted-foreground sm:ml-auto">You are the host.</p> : null}
      </CardContent>
    </Card>
  )
}

export default LobbyHeader
