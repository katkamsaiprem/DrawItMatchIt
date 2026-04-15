/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"
import type { ReactNode } from "react"

import type { LobbySession } from "@/types/game"

type GameSessionContextValue = {
  session: LobbySession
  hasLobbySession: boolean
  createLobby: (playerName: string) => void
  joinLobby: (playerName: string, lobbyCode: string) => void
  toggleMyReady: () => void
  leaveLobby: () => void
}

const EMPTY_SESSION: LobbySession = {
  playerName: "",
  lobbyCode: "",
  mode: "create",
  players: [],
  selfPlayerId: "",
}

const NOOP = () => {}

const GameSessionContext = createContext<GameSessionContextValue | undefined>(undefined)

export function GameSessionProvider({ children }: { children: ReactNode }) {
  return (
    <GameSessionContext.Provider
      value={{
        session: EMPTY_SESSION,
        hasLobbySession: false,
        createLobby: NOOP,
        joinLobby: NOOP,
        toggleMyReady: NOOP,
        leaveLobby: NOOP,
      }}
    >
      {children}
    </GameSessionContext.Provider>
  )
}

export function useGameSession() {
  const context = useContext(GameSessionContext)
  if (!context) {
    throw new Error("useGameSession must be used within GameSessionProvider")
  }
  return context
}
