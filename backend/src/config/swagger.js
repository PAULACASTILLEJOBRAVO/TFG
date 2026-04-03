// Import modules
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'TFG API Documentation',
        version: '1.0.0',
        description: 'API documentation for the TFG backend (Node.js + Express + MongoDB)',
        contact: {
            name: 'Paula Castillejo Bravo'
        },
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        }
    ],
  },
  apis: ['./src/routes/v1/*.js', './src/swagger/schemas/*.yaml'], // Path and schemas to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Export swaggerUi and swaggerSpec
module.exports = { 
  swaggerUi, 
  swaggerSpec
};