const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const uri = 'mongodb+srv://adham830:8302004@usagetracker.dlt05.mongodb.net/?retryWrites=true&w=majority&appName=usagetracker'; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB once and reuse the connection
let db; // Global variable to hold the database connection
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        db = client.db('usagetracker'); // Set the database after connection
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

// POST route to track reads and writes
app.post('/track', async (req, res) => {
    const { userId, action } = req.body;

    if (!userId || !action) {
        return res.status(400).json({ error: 'Missing userId or action' });
    }

    const log = {
        userId: userId,
        action: action,
        timestamp: new Date().toISOString()
    };

    try {
        const collection = db.collection('usage_logs'); // Use the global db variable
        await collection.insertOne(log);
        res.status(200).send('Usage tracked');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to retrieve usage logs
app.get('/logs', async (req, res) => {
    try {
        const collection = db.collection('usage_logs');
        const logs = await collection.find({}).toArray(); // Fetch all logs from the collection
        res.status(200).json(logs); // Send logs as JSON response
    } catch (error) {
        console.error('Error fetching logs from MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
