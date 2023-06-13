const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hdichay.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const classesCollection = client.db("rythmicDb").collection("classes")
    const instructorsCollection = client.db("rythmicDb").collection("instructors")
    const userCollection = client.db('rythmicDb').collection('users')
    const selectedClassCollection = client.db("rythmicDb").collection('selectedClass')

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User Already Exist' })
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // here sports = all users 
    app.get('/allUser', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.patch('/users/admin/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })


    app.get('/classes', async(req, res) => {
        const query = {};
        const options = {
            sort: {"students": -1}
        }
        const result = await classesCollection.find(query, options).toArray();
        res.send(result)
    })


    app.get('/instructors', async(req, res) => {
        const query = {};
        const options = {
            sort: {"students": -1}
        }
        const result = await instructorsCollection.find(query, options).toArray();
        res.send(result)
    })

   
// selected classes
    app.post('/selectedClass', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await selectedClassCollection.insertOne(item);
      res.send(result);
    })

    app.get('/selectedClass', async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }

      const query = { email: email };
      const result = await selectedClassCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/selectedClass/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await selectedClassCollection.deleteOne(query);
      res.send(result)
    })


    // routes to find role
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      // console.log(result);
      res.send(result);
    })
    app.get('/users/instructor/:email', async (req, res) => {
      const email = req.params.email;

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { admin: user?.role === 'instructor' }
      // console.log(result);
      res.send(result);
    })



    // admin role update
    app.patch('/users/admin/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // instructor role update
    app.patch('/users/instructor/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      };
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // student role update
    app.patch('/users/student/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          role: 'student'
        },
      };
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
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


app.get('/', (req, res) => {
    res.send('rythmic is running')
})

app.listen(port, () => {
    console.log(`rythmic server is running on the port: ${port}`)
})