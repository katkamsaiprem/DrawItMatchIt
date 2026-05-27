import { Account } from "appwrite";
import appwriteClient from ".";



/**
 * Why Class
 * -to all acc related services(methods) at one place
 * it allows us to create multiple instances(users) with diff config
 * increases scalablity
 * @class AppwriteAccount
 * @typedef {AppwriteAccount}
 */
class AppwriteAccount {
    protected appwriteAccount: Account;

    constructor() {
        this.appwriteAccount = new Account(appwriteClient)
    }


}