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



// Routes
app.get('/', (req, res) => {
  res.send('Career Code Server is running...');
});



// Start server
async function run() {
  try {
    await client.connect();

    const jobsCollection = client.db('careerCode').collection('jobs');
    const applicationsCollection = client.db('careerCode').collection('application')

    // jobs api
    app.get('/jobs', async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })


    //job application related apis

    // app.get('/applications', async (req, res) => {
    //   const email = req.query.email;

    //   const query = {
    //     applicant: email
    //   }
    //   const result = await applicationsCollection.find(query).toArray();

    //   // bad way to aggregate

    //   for (const application of result) {
    //     const jobId = application.jobId;
    //     const jobQuery = { _id: new ObjectId(jobId) }

    //     const job = await jobsCollection.findOne(jobQuery)
    //     application.company = job.company
    //     application.title = job.title
    //     application.company_logo = job.company_logo

    //   }
    //   res.send(result);
    // })

    app.get('/applications', async (req, res) => {
      const email = req.query.email;
      const query = { applicant: email };
      const result = await applicationsCollection.find(query).toArray();

      for (const application of result) {
        const jobId = application.jobId;
        const jobQuery = { _id: new ObjectId(jobId) };
        const job = await jobsCollection.findOne(jobQuery);

        if (job) {
          application.company = job.company;
          application.title = job.title;
          application.company_logo = job.company_logo;
          application.description = job.description;
        }
      }
      res.send(result);
    });


    app.post('/applications', async (req, res) => {
      const application = req.body;
      console.log(application);
      const result = await applicationsCollection.insertOne(application);
      res.send(result);
    })





    app.delete('/applications/:id', async (req, res) => {
      const id = req.params.id;
      const email = req.query.email; // frontend theke email pathabo

      const query = { _id: new ObjectId(id) };
      const application = await applicationsCollection.findOne(query);

      if (!application) {
        return res.status(404).send({ message: 'Application not found' });
      }

      if (application.applicant !== email) {
        return res.status(403).send({ message: 'Forbidden: you can only delete your own application' });
      }

      const result = await applicationsCollection.deleteOne(query);
      res.send(result);
    });





    console.log('Successfully connected to MongoDB!');

    app.listen(port, () => {
      console.log(`Career Code is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run();