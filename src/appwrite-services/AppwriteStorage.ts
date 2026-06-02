import { Storage, ID } from "appwrite";
import appwriteClient from ".";

const REF_BUKET_ID = import.meta.env.VITE_REFERENCE_IMAGES_BUCKET_ID;
const DRAWINGS_BUCKET_ID = import.meta.env.VITE_DRAWING_BUCKET_ID;

class AppwriteStorage {

    private appwriteStorage: Storage;
    constructor() {
        this.appwriteStorage = new Storage(appwriteClient)
    }

    //pick a randowm image from reference bucket from storage
    public getRandomReferenceImage = async () => {
        const fileList = await this.appwriteStorage.listFiles(REF_BUKET_ID);
        if (fileList.total === 0) throw new Error("No reference images in bucket")

        const randomIndex = Math.floor(Math.random() * fileList.files.length);
        return fileList.files[randomIndex].$id;
    }

    public getFilePreview = (fileId: string) => {
        return this.appwriteStorage.getFileView(REF_BUKET_ID, fileId);
    }

    public uploadDrawing = async (file: File) => {
        return await this.appwriteStorage.createFile(
            DRAWINGS_BUCKET_ID,
            ID.unique(),
            file,

        )
    }

    public getDrawingPreview = (fileId: string) => {
        return this.appwriteStorage.getFileView(DRAWINGS_BUCKET_ID, fileId);
    }
    
}
export const appwriteStorage = new AppwriteStorage();