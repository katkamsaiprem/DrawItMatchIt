import { Databases } from "appwrite";
import appwriteClient from ".";



class AppwriteTableDb {
    protected appwriteDb: Databases;

    constructor() {
        this.appwriteDb = new Databases(appwriteClient);
    }
}