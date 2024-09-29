const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;
const uri = process.env.MONGO_URI; 
const dbName = 'ordersDB';

let client;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client.db(dbName);
}

const allowedOrigins = ["http://127.0.0.1:5500/", "http://localhost:3000"];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/submit-order', async (req, res) => {
    const orderData = req.body;
    try {
        const db = await connectDB();
        const ordersCollection = db.collection('orders');
        const result = await ordersCollection.insertOne(orderData);

        res.json({
            message: 'Order received and inserted into MongoDB successfully!',
            orderId: result.insertedId,
        });
    } catch (error) {
        console.error('Error connecting to MongoDB or inserting document:', error);
        res.status(500).json({ message: 'Failed to insert order into MongoDB' });
    }
});

app.get('/admin/orders', async (req, res) => {
    try {
        const db = await connectDB();
        const ordersCollection = db.collection('orders');
        const orders = await ordersCollection.find({}).toArray();

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders from MongoDB:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});