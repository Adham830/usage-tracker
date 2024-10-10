const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const uri = 'mongodb+srv://adham830:8302004@usagetracker.dlt05.mongodb.net/usagetracker?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
