const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const uri = 'mongodb+srv://adham830:8302004@usagetracker.dlt05.mongodb.net/?retryWrites=true&w=majority&appName=usagetracker';
const client = new MongoClient(uri);
let db;

// Connect to MongoDB once and reuse the connection
const connectToDatabase = async () => {
    if (!db) {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('usagetracker'); // Set the database after connection
    }
    return db;
};

// Function to handle requests
module.exports = async (req, res) => {
    const db = await connectToDatabase();

    if (req.method === 'POST') {
        const { userId, action } = req.body;

        if (!userId || !action) {
            return res.status(400).json({ error: 'Missing userId or action' });
        }

        const log = {
            userId: userId,
            action: action,
            timestamp: new Date().toISOString(),
        };

        try {
            const collection = db.collection('usage_logs'); // Use the global db variable
            await collection.insertOne(log);
            return res.status(200).send('Usage tracked');
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'GET') {
        try {
            const collection = db.collection('usage_logs');
            const logs = await collection.find({}).toArray(); // Fetch all logs from the collection
            return res.status(200).json(logs); // Send logs as JSON response
        } catch (error) {
            console.error('Error fetching logs from MongoDB:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};
