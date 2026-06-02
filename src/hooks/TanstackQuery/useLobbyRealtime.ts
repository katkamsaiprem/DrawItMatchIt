//this hook subscribes to the players table and auto invalidate the tanstack query cache whenever a player changes

import { appwriteRealtime } from "@/appwrite-services/AppwriteRealtime";
import { useEffect } from "react"
import { queryClient } from "@/main"
import type { RealtimeSubscription } from "appwrite";

const PLAYERS_TABLE_ID = import.meta.env.VITE_PLAYERS_TABLE_ID;
const LOBBIES_TABLE_ID = import.meta.env.VITE_LOBBIES_TABLE_ID;


export const useLobbyRealtime = (lobbyId: string | null) => {

    useEffect(() => {
        if (!lobbyId) return;

        //store sub references for cleanup
        let playerSub: RealtimeSubscription | null = null;
        let lobbySub: RealtimeSubscription | null = null;
        let cancelled = false;//flag to prevent the racing condition on first render

        const setup = async () => {
            //sub to all player row changes
            playerSub = await appwriteRealtime.subscribeToTable(
                PLAYERS_TABLE_ID,
                (event) => {
                    //event.payload contains the changed row
                    //event.event contains the type like create, update,delete

                    //only invalidate if this player belongs to our lobby
                    const payload = event.payload as any;
                    if (payload?.lobbyId === lobbyId) {
                        queryClient.invalidateQueries({
                            queryKey: ["lobby-players", lobbyId],
                        })
                    }
                }
            );


            //sub to lobby row for status changes lke in progress
            lobbySub = await appwriteRealtime.subscribeToDocument(
                LOBBIES_TABLE_ID,
                lobbyId,
                () => {
                    queryClient.invalidateQueries({
                        queryKey: ["lobby", lobbyId]
                    })

                }

            );
            // If unmounted while awaiting, clean up immediately

            /**
             * The await takes time (network call). If the user leaves the page during that wait, 
             * the cleanup function runs but playerSub/lobbySub are still null 
             *  the subscriptions haven't been created yet. When the await finally finishes, 
             * the subscriptions exist but the cleanup already ran and missed them.
             * So after the await completes, we check: 
             * "Hey, did the component unmount while I was waiting?" If cancelled === true, 
             * we immediately unsubscribe ourselves since the cleanup function couldn't do it.
             * Without this check  leaked subscriptions that keep running forever in the background.
             */
            if (cancelled) {//guard
                playerSub?.unsubscribe();
                lobbySub?.unsubscribe();
            }
        };

        void setup();

        //cleanup on unmount or dep changes
        return () => {
            cancelled = true;
            playerSub?.unsubscribe();
            lobbySub?.unsubscribe();
        }
    }, [lobbyId, queryClient])

}
