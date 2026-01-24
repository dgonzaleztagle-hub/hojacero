
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    console.log("Testing OpenAI Connectivity...");
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a test." }, { role: "user", content: "Ping" }],
            model: "gpt-4o-mini",
        });
        console.log("Success! Status: 200 OK");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error: any) {
        console.error("OpenAI Failed.");
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        console.error("Type:", error.type);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

main();
