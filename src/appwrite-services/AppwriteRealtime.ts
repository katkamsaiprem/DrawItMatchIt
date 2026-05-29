import { Realtime } from "appwrite";
import appwriteClient from ".";


class AppwriteRealtime {
    private appwriteRealtime: Realtime;
    constructor() {
        this.appwriteRealtime = new Realtime(appwriteClient)
    }
}