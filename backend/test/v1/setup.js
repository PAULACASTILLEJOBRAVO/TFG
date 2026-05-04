// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports.connect = async () => {
  mongoose.set('strictQuery', false); // To suppress deprecation warning

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // For security reasons: If there is already an open connection, we close it first
  if( mongoose.connection.readyState !== 0 ) await mongoose.disconnect();

  await mongoose.connect(uri);
  return mongoServer;
};

module.exports.closeDatabase = async () => {
  // For security reasons: We only drop the database and close the connection if it's open
  if (mongoose.connection.readyState !== 0){
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close();
  }

  // Stop the in-memory MongoDB server
  if (mongoServer) await mongoServer.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  // Loop through each collection and delete all data
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};
