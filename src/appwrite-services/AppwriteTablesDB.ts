import { ID, Query, TablesDB } from "appwrite";
import appwriteClient from ".";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DB_ID;

const LOBBIES_TABLE_ID = import.meta.env.VITE_LOBBIES_TABLE_ID;
const PLAYERS_TABLE_ID = import.meta.env.VITE_PLAYERS_TABLE_ID;
const DRAWINGS_TABLE_ID = import.meta.env.VITE_DRAWINGS_TABLE_ID;


const generateLobbyCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

class AppwriteTableDb {
    private appwriteDb: TablesDB;

    constructor() {
        this.appwriteDb = new TablesDB(appwriteClient);
    }

    public createLobby = async (hostUserId: string, name: string) => {
        const roomId = generateLobbyCode();

        const lobby = await this.appwriteDb.createRow({
            databaseId: DATABASE_ID,
            tableId: LOBBIES_TABLE_ID,
            rowId: ID.unique(),
            data: {
                roomId,
                hostId: hostUserId,
                status: "waiting",
            },
        });

        const player = await this.appwriteDb.createRow({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            rowId: ID.unique(),
            data: {
                lobbyId: lobby.$id,
                userId: hostUserId,
                name,
                isReady: false,
                isHost: true,
                status: "thinking",
            },
        });

        return { lobby, player };
    };

    public getLobby = async (lobbyId: string) => {
        return this.appwriteDb.getRow({
            databaseId: DATABASE_ID,
            tableId: LOBBIES_TABLE_ID,
            rowId: lobbyId
        })
    }
    public joinLobby = async (lobbyCode: string, userId: string, name: string) => {
        const result = await this.appwriteDb.listRows({
            databaseId: DATABASE_ID,
            tableId: LOBBIES_TABLE_ID,
            queries: [Query.equal("roomId", lobbyCode)],
        });

        if (result.total === 0) {
            throw new Error("Lobby not found");
        }

        const lobby = result.rows[0];

        // Check if player is already in this lobby
        const existingPlayer = await this.appwriteDb.listRows({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            queries: [
                Query.equal("lobbyId", lobby.$id),
                Query.equal("userId", userId)
            ]
        });

        if (existingPlayer.total > 0) {
            return { lobby, player: existingPlayer.rows[0] };
        }

        // Check if player exists anywhere else (prevents 409 on userId unique index)
        const playerAnywhere = await this.appwriteDb.listRows({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            queries: [Query.equal("userId", userId)]
        });

        if (playerAnywhere.total > 0) {
            try {
                const player = await this.appwriteDb.updateRow({
                    databaseId: DATABASE_ID,
                    tableId: PLAYERS_TABLE_ID,
                    rowId: playerAnywhere.rows[0].$id,
                    data: {
                        lobbyId: lobby.$id,
                        name,
                        isReady: false,
                        isHost: false,
                        status: "thinking"
                    }
                });
                return { lobby, player };
            } catch (error: any) {
                if (error.code === 409) {
                    throw new Error("This name is already taken in the lobby. Please choose a different name.");
                }
                throw error;
            }
        }

        const rowId = ID.unique();
        try {
            const player = await this.appwriteDb.createRow({
                databaseId: DATABASE_ID,
                tableId: PLAYERS_TABLE_ID,
                rowId,
                data: {
                    lobbyId: lobby.$id,
                    userId,
                    name,
                    isReady: false,
                    isHost: false,
                    status: "thinking",
                },
            });
            return { lobby, player };
        } catch (error: any) {
            if (error.code === 409) {
                try {
                    const fallbackPlayer = await this.appwriteDb.getRow({
                        databaseId: DATABASE_ID,
                        tableId: PLAYERS_TABLE_ID,
                        rowId
                    });
                    return { lobby, player: fallbackPlayer };
                } catch (e) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const fallbackPlayerList = await this.appwriteDb.listRows({
                        databaseId: DATABASE_ID,
                        tableId: PLAYERS_TABLE_ID,
                        queries: [
                            Query.equal("lobbyId", lobby.$id),
                            Query.equal("userId", userId)
                        ]
                    });
                    if (fallbackPlayerList.total > 0) {
                        return { lobby, player: fallbackPlayerList.rows[0] };
                    }
                }
                // If 409 but fallback didn't catch a race condition, it's a genuine unique constraint violation (like name)
                throw new Error("This name is already taken in the lobby. Please choose a different name.");
            }
            throw error;
        }
    };

    public toggleReady = async (playerId: string, isReady: boolean) => {
        return this.appwriteDb.updateRow({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            rowId: playerId,
            data: { isReady },
        });
    };

    public startGame = async (lobbyId: string, referenceImageId: string) => {
        return this.appwriteDb.updateRow({
            databaseId: DATABASE_ID,
            tableId: LOBBIES_TABLE_ID,
            rowId: lobbyId,
            data: {
                status: "in_progress",
                referenceImageId: referenceImageId
            },
        });
    };

    public getLobbyPlayers = async (lobbyId: string) => {
        return this.appwriteDb.listRows({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            queries: [Query.equal("lobbyId", lobbyId)],
        });
    };

    public saveDrawing = async (lobbyId: string, playerId: string, fileId: string) => {
        const drawing = await this.appwriteDb.createRow({
            databaseId: DATABASE_ID,
            tableId: DRAWINGS_TABLE_ID,
            rowId: ID.unique(),
            data: { lobbyId, playerId, fileId },
        });

        await this.appwriteDb.updateRow({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            rowId: playerId,
            data: { status: "finished" }
        })
        return drawing;
    }


    public getDrawing = async (lobbyId: string) => {
        return this.appwriteDb.listRows({
            databaseId: DATABASE_ID,
            tableId: DRAWINGS_TABLE_ID,
            queries: [Query.equal("lobbyId", lobbyId)]
        })
    }

    //reset game for all players for another round
    /**
     * Resets the lobby for all players for another around
     * 
     * set lobby back to waiting
     * set each player back to thinking and not ready
     * @param lobbyId Lobby ID
     * @param playerIds Array of player IDs
     */
    public resetGame = async (lobbyId: string, playerIds: string[]) => {

        await this.appwriteDb.updateRow({
            databaseId: DATABASE_ID,
            tableId: LOBBIES_TABLE_ID,
            rowId: lobbyId,
            data: { status: "waiting" }
        })

        for (let i = 0; i < playerIds.length; i++) {
            await this.appwriteDb.updateRow({
                databaseId: DATABASE_ID,
                tableId: PLAYERS_TABLE_ID,
                rowId: playerIds[i],
                data: { status: "thinking", isReady: false }
            })

        }

    }
}

export const appwriteDb = new AppwriteTableDb();