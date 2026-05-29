import { Client } from "appwrite";

//create client then connect with the appwrite project endpoint
const appwriteClient = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export default appwriteClient;