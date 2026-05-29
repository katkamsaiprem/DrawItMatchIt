import { Account } from "appwrite";
import appwriteClient from ".";



/**
 * Why Class
 * -to all acc related services(methods) at one place
 * it allows us to create multiple instances(users) with diff config
 * increases scalablity
 * @class AppwriteAccount
 * 
 * we are using singleton pattern,if you remove the exported instance only export the class ,then its no longer singleton
 * @typedef {AppwriteAccount}
 */
class AppwriteAccount {
    private appwriteAccount: Account;


    constructor() {
        this.appwriteAccount = new Account(appwriteClient)
    }



    /**
     * create an anonymous session on app startup
     * goal is ensure every user gets an appwrite id
     *
     * @async
     * @returns {unknown} 
     */
    public ensureSession = async () => {
        try {
            const user = await this.appwriteAccount.get();
            return user.$id;
        }
        catch {
            const session = await this.appwriteAccount.createAnonymousSession();
            return session.$id;
        }
    }




}
export const appwriteAccount = new AppwriteAccount();