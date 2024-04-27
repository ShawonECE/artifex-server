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

async function run() {
    try {
        await client.connect();

        app.get('/', async (req, res) => {
            res.send('Welcome to artifex');
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
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port);