import { Storage } from "appwrite";
import appwriteClient from ".";


class AppwriteStorage {

    private appwriteStorage: Storage;
    constructor() {
        this.appwriteStorage = new Storage(appwriteClient)
    }
}