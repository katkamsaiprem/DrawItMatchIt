import { Realtime, type RealtimeResponseEvent } from "appwrite";
import appwriteClient from ".";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DB_ID;


class AppwriteRealtime {
    private appwriteRealtime: Realtime;
    constructor() {
        this.appwriteRealtime = new Realtime(appwriteClient)
    }

    /**
     * Subscribes to all changes (create, update, delete) in a Table.
     * @param tableId ID of the table to subscribe to.
     * @param callback Callback function to be called when a row is created, updated, or deleted.
     * @returns Unsubscribe function.
     */
    public subscribeToTable = async (
        tableId: string,
        callback: (event: RealtimeResponseEvent<any>) => void
    ) => {
        const channel = `databases.${DATABASE_ID}.collections.${tableId}.documents`;
        return this.appwriteRealtime.subscribe(channel, callback)
    }


    /**
     * Subscribes to changes in a specific row
     * @param tableId ID of the table to subscribe to.
     * @param rowId ID of the row to subscribe to.
     * @param callback Callback function to be called when a row is created, updated, or deleted.
     * @returns Unsubscribe function.
     */
    public subscribeToDocument = async (
        tableId: string,
        rowId: string,
        callback: (event: RealtimeResponseEvent<any>) => void

    ) => {
        //build a channel string for a single row
        const channel = `databases.${DATABASE_ID}.collections.${tableId}.documents.${rowId}`
        return this.appwriteRealtime.subscribe(channel, callback);
    }
}

export const appwriteRealtime = new AppwriteRealtime();