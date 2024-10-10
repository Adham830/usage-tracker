const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Import MongoDB client

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON data

// MongoDB connection configuration
const uri = 'mongodb+srv://adham830:<8302004>@usagetracker.dlt05.mongodb.net/?retryWrites=true&w=majority&appName=usagetracker'; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

// GET route to test in the browser
app.get('/', (req, res) => {
    res.send('Hello! The server is running.');
});

// GET route for /track to respond with a simple message
app.get('/track', (req, res) => {
    res.send('Track endpoint is working. Please send a POST request.');
});

// POST route to track reads and writes
app.post('/track', async (req, res) => {
    const { userId, action } = req.body;

    // Check if both userId and action are provided
    if (!userId || !action) {
        return res.status(400).json({ error: 'Missing userId or action' });
    }

    const log = {
        userId: userId,
        action: action,
        timestamp: new Date().toISOString()
    };

    try {
        await client.connect(); // Connect to MongoDB
        const database = client.db('usagetracker'); // Replace with your database name
        const collection = database.collection('usage_logs'); // Collection for logging

        // Insert log data into MongoDB
        await collection.insertOne(log);
        res.status(200).send('Usage tracked');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the connection
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
