const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

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
    const log = `${new Date().toISOString()} - User: ${userId}, Action: ${action}\n`;
    fs.appendFileSync('usage.log', log);
    res.status(200).send('Usage tracked');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
