import { appwriteStorage } from "@/appwrite-services/AppwriteStorage"



const ReferenceImage = ({ imageId }: { imageId: string }) => {
    const imageUrl = appwriteStorage.getFilePreview(imageId);

    return (
        <div className="absolute top-12 left-2 z-10">

            <div className="group relative cursor-crosshair">
                <img
                    src={imageUrl}
                    alt="Target to draw"
                    className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-2xl border-4 border-indigo-200/50 object-cover shadow-xl backdrop-blur-sm transition-transform duration-300 origin-top-left group-hover:scale-[2.5] group-hover:shadow-2xl bg-white"
                />


                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-max rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-bold tracking-widest text-white shadow-md transition-opacity duration-300 group-hover:opacity-0">
                    TARGET
                </div>
            </div>
        </div>
    )
}

export default ReferenceImage