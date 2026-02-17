const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const AIEngine = require('../services/aiEngine');

// 1. নতুন মেসেজ পাঠানো এবং সেভ করা
router.post('/chat', async (req, res) => {
    try {
        const { message, model, userId, chatId } = req.body;

        if (!message) return res.status(400).json({ error: "Message is required" });

        // ১. আগের চ্যাট হিস্ট্রি নিয়ে আসা (স্মার্ট কনটেক্সটের জন্য)
        let history = [];
        let chatSession;

        if (chatId) {
            chatSession = await Chat.findById(chatId);
            if (chatSession) {
                history = chatSession.messages.map(m => ({ role: m.role, content: m.content }));
            }
        }

        // ২. AI সার্ভিস কল করা
        const aiResponse = await AIEngine.generateResponse(message, model || 'gpt-4', history.slice(-5)); // লাস্ট ৫টা মেসেজ মেমোরি হিসেবে পাঠাবে

        // ৩. ডাটাবেসে সেভ করা (যদি chatId থাকে)
        if (chatSession) {
            chatSession.messages.push({ role: 'user', content: message });
            chatSession.messages.push({ role: 'assistant', content: aiResponse });
            chatSession.updatedAt = Date.now();
            await chatSession.save();
        } else {
            // নতুন চ্যাট ক্রিয়েট করা
            chatSession = await Chat.create({
                userId: userId || 'anonymous',
                modelUsed: model,
                messages: [
                    { role: 'user', content: message },
                    { role: 'assistant', content: aiResponse }
                ]
            });
        }

        // ৪. ফ্রন্টেন্ডে রেসপন্স পাঠানো
        res.json({ 
            reply: aiResponse, 
            chatId: chatSession._id 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. চ্যাট হিস্ট্রি লোড করা
router.get('/history/:userId', async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: "Failed to load history" });
    }
});

module.exports = router;
