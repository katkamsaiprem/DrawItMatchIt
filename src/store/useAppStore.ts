import { create } from "zustand";


type AppState = {
    userId: string | null;
    lobbyId: string | null;
    playerId: string | null;
    lobbyCode: string | null;
    setUserId: (id: string | null) => void;
    setLobbyId: (id: string | null) => void;
    setPlayerId: (id: string | null) => void;
    setLobbyCode: (code: string | null) => void;

}
//set function merges state
export const useAppStore = create<AppState>((set) => ({
    userId: null,
    lobbyId: null,
    playerId: null,
    lobbyCode: null,
    setUserId: (userId) => set({ userId }),
    setLobbyId: (lobbyId) => set({ lobbyId }),
    setPlayerId: (playerId) => set({ playerId }),
    setLobbyCode: (lobbyCode) => set({ lobbyCode })

}))