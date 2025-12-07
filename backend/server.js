//Import necessary modules
const app = require('./app');
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const debug = require('debug')('backend:server');

//Configure environment variables
require('dotenv').config();

debug('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? 'Defined' : 'Not Defined',
});

// Do NOT run server or connect to the real DB during tests
if (process.env.NODE_ENV === 'test') {
  debug("Test environment detected. Server and DB will NOT start.");
  module.exports = server; // Export server instance for testing if needed
}else{
  // Database connection string
  const MONGO_URI = process.env.MONGO_URI;

  //Connect to database
  mongoose.connect(MONGO_URI).then(() => {
      debug('MongoDB connected!');

      //Start server
      const PORT = process.env.PORT || 3000;

      server.listen(PORT, () => {
        debug(`Server is running on port ${PORT}`);
      });

  }).catch(err => {
      debug(Error,'Error connecting to database! \n', err);
      process.exit(1);
  });

  server.on('error', (error) => {
      console.error('Server error: ', error);
      process.exit(1);
  });

  process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

}