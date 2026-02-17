const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// 1. OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 2. Google Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIEngine {
    static async generateResponse(prompt, modelType, history = []) {
        try {
            console.log(`🧠 AI Engine Processing: ${modelType}`);

            // --- OPTION A: GPT-4 / GPT-3.5 ---
            if (modelType.includes('gpt')) {
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are Nexus, an advanced AI assistant." },
                        ...history, // পুরনো চ্যাট হিস্ট্রি পাঠানো হচ্ছে
                        { role: "user", content: prompt }
                    ],
                    model: modelType === 'gpt-4' ? "gpt-4" : "gpt-3.5-turbo",
                });
                return completion.choices[0].message.content;
            }

            // --- OPTION B: Google Gemini ---
            else if (modelType.includes('gemini')) {
                const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            }

            // --- Fallback ---
            else {
                return "Error: Unknown model type selected.";
            }

        } catch (error) {
            console.error("AI Engine Error:", error);
            return `System Error: ${error.message}`;
        }
    }
}

module.exports = AIEngine;
