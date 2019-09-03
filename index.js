const MongoClient = require('mongodb').MongoClient,
  Hapi = require('@hapi/hapi');

const url = 'mongodb://localhost:27017';
const dbName = 'learning_mongo';

const init = async collection => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost'
  });

  server.route([
    // Get tour list
    {
      method: 'GET',
      path: '/api/tours',
      config: { json: { space: 2 } },
      handler: (request, h) => {
        const findObject = {};
        for (let key in request.query) {
          findObject[key] = request.query[key];
        }
        return collection.find(findObject).toArray();
      }
    },
    // Add new tour
    {
      method: 'POST',
      path: '/api/tours',
      handler: (request, h) => {
        return collection.insertOne(request.payload);
      }
    },
    // Get a single tour
    {
      method: 'GET',
      path: '/api/tours/{name}',
      handler: (request, h) => {
        return collection.findOne({ 'tourName': request.params.name });
      }
    },
    // Update a single tour
    {
      method: 'PUT',
      path: '/api/tours/{name}',
      handler: (request, reply) => {
        // request.payload variables
        if (request.query.replace) {
          request.payload.tourName = request.params.name;
          collection.replaceOne({ 'tourName': request.params.name }, request.payload);
          return collection.findOne({ 'tourName': request.params.name });
        }

        collection.updateOne({ 'tourName': request.params.name }, { $set: request.payload });
        return collection.findOne({ 'tourName': request.params.name });
      }
    },
    // Delete a single tour
    {
      method: 'DELETE',
      path: '/api/tours/{name}',
      handler: (request, reply) => {
        collection.deleteOne({ 'tourName': request.params.name });
        return `Deleting ${request.params.name}`;
      }
    },
    // Home page
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        return 'Hello world from Hapi/Mongo example.';
      }
    }
  ]);
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  console.log('connected correctly to server');
  const db = client.db(dbName);
  let collection = db.collection('tours');

  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });

  init(collection);
});
