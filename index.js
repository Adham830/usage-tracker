const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON data

// GET route to test in the browser
app.get('/', (req, res) => {
    res.send('Hello! The server is running.');
});

// GET route for /track to respond with a simple message
app.get('/track', (req, res) => {
    res.send('Track endpoint is working. Please send a POST request.');
});

// POST route to track reads and writes
app.post('/track', (req, res) => {
    const { userId, action } = req.body;

    // Check if both userId and action are provided
    if (!userId || !action) {
        return res.status(400).json({ error: 'Missing userId or action' });
    }

    const log = `${new Date().toISOString()} - User: ${userId}, Action: ${action}\n`;

    // Append to the log file asynchronously to avoid blocking the server
    fs.appendFile('usage.log', log, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Successfully logged usage
        res.status(200).send('Usage tracked');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
