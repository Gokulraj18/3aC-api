const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5500;

// MongoDB connection URI and database name
const uri = process.env.MONGO_URI; // Use the MongoDB URI from the .env file
const dbName = 'ordersDB';

// Enable CORS for specified origins

app.use(cors({
    origin: ["http://127.0.0.1:5500/"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})
// Endpoint to submit an order
app.post('/submit-order', async (req, res) => {
    const orderData = req.body;

    // Connect to MongoDB and insert order
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db(dbName);
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.insertOne(orderData);

        res.json({
            message: 'Order received and inserted into MongoDB successfully!',
            orderId: result.insertedId,
        });

        await client.close();
    } catch (error) {
        console.error('Error connecting to MongoDB or inserting document:', error);
        res.status(500).json({ message: 'Failed to insert order into MongoDB' });
    }
});

app.get('/admin/orders', async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db(dbName);
        const ordersCollection = db.collection('orders');

        const orders = await ordersCollection.find({}).toArray();

        res.json(orders);

        await client.close();
    } catch (error) {
        console.error('Error fetching orders from MongoDB:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});