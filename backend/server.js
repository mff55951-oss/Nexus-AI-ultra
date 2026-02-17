const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors()); // সব ডোমেইন থেকে রিকোয়েস্ট এক্সেপ্ট করার জন্য
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // ফ্রন্টেন্ড ফাইল সার্ভ করার জন্য

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected (Power Level: High)'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --- Routes ---
app.use('/api', chatRoutes);

// বেসিক রুট (টেস্টিং)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`
    🚀 NEXUS BACKEND SYSTEMS ONLINE
    --------------------------------
    📡 Server running on: http://localhost:${PORT}
    🧠 AI Engine: ACTIVE
    🗄️ Database: CONNECTED
    --------------------------------
    `);
});
