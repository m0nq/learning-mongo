const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'learning_mongo';

// find documents
const findDocuments = (db, callback) => {
  const toursCollection = db.collection('tours');

  toursCollection.find({'tourPackage': 'Snowboard Cali'}).toArray((err, docs) => {
    console.log('Found the following records');
    console.log(docs);
    callback(docs);
  });
};

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  console.log('Connected successfully to server');

  const learningMongoDB = client.db(dbName);

  findDocuments(learningMongoDB, docs => {
    client.close();
  });
});
