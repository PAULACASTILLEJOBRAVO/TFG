//Import necessary modules
const app = require('./app');
const server = require('http').createServer(app);
const debug = require('debug')('backend:server');

//Configure environment variables
require('dotenv').config();

//Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
    console.error('Server error: ', error);
    process.exit(1);
});