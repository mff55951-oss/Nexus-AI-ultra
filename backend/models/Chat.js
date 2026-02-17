const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, // ফায়ারবেস বা সেশন ID
    title: { type: String, default: 'New Conversation' },
    modelUsed: { type: String, default: 'gpt-4' },
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
