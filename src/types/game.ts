export type LobbyMode = "create" | "join"

export type LobbyPlayer = {
  id: string
  name: string
  isReady: boolean
  isHost: boolean
  avatarURL?: string
  status?: "drawing" | "finished" | "thinking"
  statusText?: string
}

export type LobbySession = {
  playerName: string
  lobbyCode: string
  mode: LobbyMode
  players: LobbyPlayer[]
  selfPlayerId: string
}
