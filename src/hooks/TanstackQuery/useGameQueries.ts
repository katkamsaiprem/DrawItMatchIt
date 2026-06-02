import { appwriteStorage } from "@/appwrite-services/AppwriteStorage"
import { appwriteDb } from "@/appwrite-services/AppwriteTablesDB"
import type { LobbyPlayer } from "@/types/game"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


//Query to fetch players for a lobby
export const useLobbyPlayers = (lobbyId: string | null) => {
    return useQuery<LobbyPlayer[]>({
        queryKey: ["lobby-players", lobbyId],
        queryFn: async () => {
            const result = await appwriteDb.getLobbyPlayers(lobbyId!)
            return result.rows.map((row: any) => ({
                id: row.$id,
                name: row.name,
                isReady: row.isReady,
                isHost: row.isHost,
                status: row.status,
                avatarURL: row.avatarURL,
                statusText: row.statusText,
            }))
        },
        enabled: !!lobbyId,//only runs when lobbyid exists
    })
}

//Query fetch lobby status
export const useLobbyStatus = (lobbyId: string | null) => {
    return useQuery<{ status: string, referenceImageId?: string }>({
        queryKey: ["lobby-status", lobbyId],
        queryFn: async () => {
            const result = await appwriteDb.getLobby(lobbyId!);
            return {
                status: result.status,
                referenceImageId: result.referenceImageId
            }
        },
        enabled: !!lobbyId,//only runs when lobbyid exists
    })
}

//Mutation: create  a new lobby
export const useCreateLobby = () => {
    return useMutation({
        retry: false,  // prevent retry on failure
        mutationFn: async ({
            userId,
            playerName,
        }: {
            userId: string;
            playerName: string;
        }) => {
            return appwriteDb.createLobby(userId, playerName);
        },
        onSuccess: ({ lobby, player }) => {//sync with Db
            localStorage.setItem("lobbyId", lobby.$id)
            localStorage.setItem("playerId", player.$id)
            localStorage.setItem("lobbyCode", lobby.roomId ?? "")
        }
    })
}

//mutation join an existing lobby
export const useJoinLobby = () => {
    return useMutation({
        retry: false,  // prevent retry on failure
        mutationFn: async ({
            lobbyCode,
            userId,
            playerName,
        }: {
            lobbyCode: string;
            userId: string;
            playerName: string;
        }) => {
            return appwriteDb.joinLobby(lobbyCode, userId, playerName)
        },
        onSuccess: ({ lobby, player }) => {
            localStorage.setItem("lobbyId", lobby.$id);
            localStorage.setItem("playerId", player.$id);
            localStorage.setItem("lobbyCode", lobby.roomId ?? "");
        }

    })
}

//Mutation toggle ready status
export const useToggleReady = (lobbyId: string | null) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            playerId,
            isReady,
        }: {
            playerId: string;
            isReady: boolean;
        }) => {
            return appwriteDb.toggleReady(playerId, isReady)
        },
        onSuccess: () => {
            //refresh the lobby players list to sync ready status
            queryClient.invalidateQueries({
                queryKey: ["lobby-players", lobbyId]
            })
        }
    })
}

//mutation start the game
export const useStartGame = () => {
    return useMutation({
        mutationFn: async (lobbyId: string) => {
            const imageId = await appwriteStorage.getRandomReferenceImage();
            return appwriteDb.startGame(lobbyId, imageId);
        }
    })
}

//hook for upload drawings to storage bucket and update the player row status to finished

export const useSubmitDrawings = () => {
    return useMutation({
        mutationFn: async ({
            lobbyId,
            playerId,
            file,
        }: {
            lobbyId: string;
            playerId: string;
            file: File;
        }) => {
            //upload to storage bucket
            const uploadedFile = await appwriteStorage.uploadDrawing(file);

            //save row to db and update player status to finished
            return appwriteDb.saveDrawing(lobbyId, playerId, uploadedFile.$id)
        },

    })
}