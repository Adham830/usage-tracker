const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Endpoint to track reads and writes
app.post('/track', (req, res) => {
    const { userId, action } = req.body;
    const log = `${new Date().toISOString()} - User: ${userId}, Action: ${action}\n`;
    fs.appendFileSync('usage.log', log);
    res.status(200).send('Usage tracked');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
