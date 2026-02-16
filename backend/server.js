const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example secure API call
app.get('/api/secure-data', (req, res) => {
    // Mocked secure data
    const secureData = { message: 'This is secure data.' };
    res.json(secureData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
