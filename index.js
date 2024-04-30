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

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id
      const formData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name:formData.name,
          description:formData.description,
          category:formData.category,
          price:formData.price,
          imageURL:formData.imageURL,
          materialsUsed:formData.materialsUsed,
          craftingTechnique:formData.craftingTechnique,
          color:formData.color,
          availability:formData.availability
        },
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      res.send(result)
    });

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});