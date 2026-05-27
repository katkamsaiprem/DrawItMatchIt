import { Realtime } from "appwrite";
import appwriteClient from ".";


class AppwriteRealtime {
    protected appwriteRealtime: Realtime;
    constructor() {
        this.appwriteRealtime = new Realtime(appwriteClient)
    }
}