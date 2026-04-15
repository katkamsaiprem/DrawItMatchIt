export type LobbyMode = "create" | "join"

export type LobbyPlayer = {
  id: string
  name: string
  isReady: boolean
  isHost: boolean
}

export type LobbySession = {
  playerName: string
  lobbyCode: string
  mode: LobbyMode
  players: LobbyPlayer[]
  selfPlayerId: string
}
