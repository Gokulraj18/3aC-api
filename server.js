const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
<<<<<<< HEAD
const cors = require('cors'); 
=======
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
>>>>>>> f5772de6cd5362b998e44cab096a0f3f1cd65f80

const app = express();
const port = 5500;

// MongoDB connection URI and database name
<<<<<<< HEAD
const uri = "mongodb+srv://agokulraj2003:PxxM57AYI5yG4mku@gokulraj.o9kty.mongodb.net/?retryWrites=true&w=majority&appName=Gokulraj"; // Make sure your MongoDB is running on this address
=======
const uri = process.env.MONGO_URI; // Use the MongoDB URI from the .env file
>>>>>>> f5772de6cd5362b998e44cab096a0f3f1cd65f80
const dbName = 'ordersDB';

// Enable CORS for specified origins
app.use(cors({
<<<<<<< HEAD
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501'], // Added your origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
=======
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
>>>>>>> f5772de6cd5362b998e44cab096a0f3f1cd65f80
}));

app.use(bodyParser.json());

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

// Endpoint to get all orders for admin
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