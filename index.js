const express = require("express");
const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.send("teddyBear server is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kjf5ogd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      client.connect();
      // Send a ping to confirm a successful connection
      const toyCategory = client.db("toyshopDB").collection("toys");

      //   post
      app.post("/toys", async (req, res) => {
         console.log("toys sent");
         const newTeddy = req.body;
         console.log(newTeddy);
         const result = await toyCategory.insertOne(newTeddy);
         res.send(result);
      });

      //   sorting by email
      app.get("/toys", async (req, res) => {
         let query = {};
         if (req.query?.email) {
            query = { email: req.query.email };
         }
         const result = await toyCategory.find(query).toArray();
         res.send(result);
      });

      // READ
      app.get("/toys", async (req, res) => {
         const cursor = toyCategory.find({}).limit(20);
         const result = await cursor.toArray();

         res.send(result);
      });

      //   delete
      app.delete("/toys/:id", async (req, res) => {
         const id = req.params.id;
         const deleteOne = { _id: new ObjectId(id) };
         const result = await toyCategory.deleteOne(deleteOne);
         res.send(result);
      });

      //   data fine by id
      app.get("/toys/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await toyCategory.findOne(query);
         res.send(result);
      });
      //   update
      app.put("/toys/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) };
         const options = { upsert: true };
         const toy = req.body;
         console.log(toy, id);
         const updateToy = {
            $set: {
               price: toy.price,
               quantity: toy.quantity,
               name: toy.name,
               photo: toy.photo,
               discription: toy.details,
            },
         };
         const result = await toyCategory.updateOne(filter, updateToy, options);
         res.send(result);
      });

      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.dir);

app.listen(port, () => {
   console.log(`server listening on port ${port}`);
});
