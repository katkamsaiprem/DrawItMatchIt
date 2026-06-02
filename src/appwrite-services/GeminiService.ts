import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

//func that download an images from appwrite and convert into base64 for gemini

const urlToGenerativePart = async (url: string) => {
    // Append a unique query param to bypass cached responses that lack CORS headers
    const bypassCacheUrl = `${url}&cachebust=${Date.now()}`;
    const response = await fetch(bypassCacheUrl, {
        headers: {
            "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT_ID
        }
    });// get img from appwrite
    const blob = await response.blob();//converts image file into binary data
    const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);//reads blob as data url
    })

    return {
        inlineData: {
            data: base64.split(",")[1],//removes data:mime + type header
            mimeType: blob.type
        }
    }
}

export const scoreDrawing = async (referenceUrl: string, drawingUrl: string) => {

    //I used gemini-3.5-flash model becase it is best for vision data

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const refPart = await urlToGenerativePart(referenceUrl);
    const drawPart = await urlToGenerativePart(drawingUrl);

    const prompt = `You are judge in a drawing competition.
    Image 1 is the reference target.
    Image 2 is the palyer's drawing.
    
    Rate how will the drawing matches the reference on a scale of 0 to 100. Be strict but fair
    Also provide a short 1-2 sentence funny and sarcastic critique.
    
    Return the result EXACTLY as JSON in this format with no extra text:
    {
      "score": 85,
      "critique": "A valiant effort, but your cat looks more like a potato!"
    }`;

    try {
        const result = await model.generateContent([prompt, refPart, drawPart]);
        const responseText = result.response.text();

        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned) as { score: number, critique: string }

    }
    catch (e) {
        console.error("Failed to parse Gemini response: ", e);
        return { score: 50, critique: "The AI judge was too confused by your drawing to score it properly" };

    }
}