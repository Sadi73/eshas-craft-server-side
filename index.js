const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://esha-craft:lOeiB4BYxxDZQcBv@cluster0.jcb8og7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const collection = client.db("esha-craft").collection("craftItem");

    app.get('/all', async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();

      res.send(result)
    });

    app.get('/craft', async (req, res) => {
      const query = { createdBy: req.query.email };
      const cursor = collection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get('/details/:craftId', async (req, res) => {
      const id = req.params.craftId;
      const query = { _id: new ObjectId(id) };
      const cursor = collection.find(query);
      const result = await cursor.toArray();
      console.log(result)

      res.send(result);
    });

    app.post('/add', async (req, res) => {
      const formData = req.body;
      console.log(formData);
      const result = await collection.insertOne(formData);
      res.send(result)
    });

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});