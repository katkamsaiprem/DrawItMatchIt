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

        // Use upsertRow with userId as rowId — this creates the row if it
        // doesn't exist, or replaces it if it does. Completely avoids 409
        // conflicts from stale player rows or cross-session permission issues.
        const player = await this.appwriteDb.upsertRow({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            rowId: hostUserId,
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

        // Use upsertRow with userId as rowId — this creates the row if it
        // doesn't exist, or replaces it if it does. Completely avoids 409
        // conflicts from stale player rows or cross-session permission issues.
        const player = await this.appwriteDb.upsertRow({
            databaseId: DATABASE_ID,
            tableId: PLAYERS_TABLE_ID,
            rowId: userId,
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