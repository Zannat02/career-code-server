const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pvt1qcu.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database
// const db = client.db('careerCodeDB');
// const usersCollection = db.collection('users');
// const jobsCollection = db.collection('jobs');
// const applicationsCollection = db.collection('applications');

// Routes
app.get('/', (req, res) => {
  res.send('Career Code Server is running...');
});



// Start server
async function run() {
  try {
    await client.connect();

    console.log('Successfully connected to MongoDB!');

    app.listen(port, () => {
      console.log(`Career Code is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run();