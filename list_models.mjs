import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Load .env manually for quick test
const env = fs.readFileSync(".env", "utf8");
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        // Unfortunately listModels doesn't exist in all SDK versions, wait let's try fetch directly to the API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
