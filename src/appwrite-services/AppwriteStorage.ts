import { Storage } from "appwrite";
import appwriteClient from ".";


class AppwriteStorage {

    protected appwriteStorage: Storage;
    constructor() {
        this.appwriteStorage = new Storage(appwriteClient)
    }
}