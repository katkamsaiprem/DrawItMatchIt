import { ID, Query, TablesDB } from "appwrite";
import appwriteClient from ".";


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DB_ID;

const LOBBIES_TABLE_ID = import.meta.env.LOBBIES_TABLE_ID;
const PLAYERS_TABLE_ID = import.meta.env.PLAYERS_TABLE_ID;

const generateLobbyCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

class AppwriteTableDb {
    private appwriteDb: TablesDB;

    constructor() {
        this.appwriteDb = new TablesDB(appwriteClient);
    }

    public createLobby = async (hostUserId: string, name: string) => {
        const roomId = generateLobbyCode();

        const lobby = await this.appwriteDb.createRow(
            DATABASE_ID,
            LOBBIES_TABLE_ID,
            ID.unique(),
            {
                roomId,
                hostId: hostUserId,
                status: "waiting",

            }

        )

        const player = await this.appwriteDb.createRow(
            DATABASE_ID,
            PLAYERS_TABLE_ID,
            ID.unique(),
            {
                lobbyId: lobby.$id,
                userId: hostUserId,
                name,
                isReady: false,
                isHost: true,
                status: "thinking",

            }
        )

        return { lobby, player }
    }

    public joinLobby = async (lobbyCode: string, userId: string, name: string) => {
        const result = await this.appwriteDb.listRows(
            DATABASE_ID,
            LOBBIES_TABLE_ID,
            [Query.equal("roomId", lobbyCode)]
        )

        if (result.total === 0) {
            throw new Error("Lobby not found")
        }

        const lobby = result.rows[0];

        const player = await this.appwriteDb.createRow(
            DATABASE_ID,
            PLAYERS_TABLE_ID,
            ID.unique(), {
            lobbyId: lobby.$id,
            userId,
            name,
            isReady: false,
            isHost: false,
            status: "thinking",
        }
        )

        return { lobby, player }
    }

    public toggleReady = async (playerId: string, isReady: boolean) => {
        return this.appwriteDb.updateRow(
            DATABASE_ID,
            PLAYERS_TABLE_ID,
            playerId,
            { isReady }
        )
    }


    public startGame = async (lobbyId: string) => {
        return await this.appwriteDb.updateRow(
            DATABASE_ID,
            LOBBIES_TABLE_ID,
            lobbyId,
            { status: "in_progress" }
        )
    }

    public getLobbyPlayers = async (lobbyId: string) => {
        return this.appwriteDb.listRows(
            DATABASE_ID,
            PLAYERS_TABLE_ID,
            [Query.equal("lobbyId", lobbyId)]
        )
    }
}

export const appwriteDb = new AppwriteTableDb()