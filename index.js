const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db("artifex");
const coll = db.collection("sculptures");
const collCategory = db.collection("categories");

async function run() {
    try {
        await client.connect();

        app.get('/', async (req, res) => {
            res.send('Welcome to artifex');
        });

        app.post('/', async (req, res) => {
            const data = req.body;
            const result = await coll.insertOne(data);
            res.send(result);
        });

        app.get('/categories', async (req, res) => {
            const result = await collCategory.find({}).toArray();
            res.send(result);
        });

        app.get('/sculptures', async (req, res) => {
            const result = await coll.find({}).toArray();
            res.send(result);
        });

        app.get('/sculptures/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await coll.findOne({ _id: id });
            res.send(result);
        });

        app.get('/some_sculptures', async (req, res) => {
            const result = await coll.find({}).limit(9).toArray();
            res.send(result);
        });

        app.get('/sculptures/categories/:category', async (req, res) => {
            const category = req.params.category;
            const result = await coll.find({subcategory_name: category}).toArray();
            res.send(result);
        });

        app.get('/sculptures/user/:email', async (req, res) => {
            const email = req.params.email;
            const result = await coll.find({userEmail: email}).toArray();
            res.send(result);
        });

        app.delete('/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await coll.deleteOne({_id: id});
            res.send(result);
        });

        app.patch('/:id', async (req, res) => {
            const data = req.body;
            const id = new ObjectId(req.params.id);
            const updateDoc = {
                $set: {
                    item_name: data.item_name,
                    subcategory_name: data.subcategory_name,
                    short_description: data.short_description,
                    customization: data.customization,
                    price: data.price,
                    rating: data.rating,
                    image: data.image,
                    processing_time: data.processing_time,
                    stock_status: data.stock_status
                },
            };
            const result = await coll.updateOne({_id: id}, updateDoc, { upsert: true });
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port);