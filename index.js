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
      config: {json: { space: 2}},
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
      handler: (request, reply) => {
        reply('Adding new tour');
      }
    },
    // Get a single tour
    {
      method: 'GET',
      path: '/api/tours/{name}',
      handler: (request, h) => {
        return collection.findOne({'tourName': request.params.name});
      }
    },
    // Update a single tour
    {
      method: 'PUT',
      path: '/api/tours/{name}',
      handler: (request, reply) => {
        // request.payload variables
        reply(`Updating ${request.params.name}`);
      }
    },
    // Delete a single tour
    {
      method: 'DELETE',
      path: '/api/tours/{name}',
      handler: (request, reply) => {
        reply(`Deleting ${request.params.name}`).code(204);
      }
    },
    // Home page
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('Hello world from Hapi/Mongo example.');
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
