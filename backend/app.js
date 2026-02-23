//Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');
const logger = require("morgan");

//Configure debug
const debug = require('debug')('backend:app');

//Configure enviroment variables
dotenv.config();

//Configure Express
const app = express();

//Import routes
const rootRouter = require('./src/routes/root');
const authenticationRoutes = require('./src/routes/v1/authenticationRoutes');
const clickerRoutes = require('./src/routes/v1/clickerRoutes');
const difficultyRoutes = require('./src/routes/v1/difficultyRoutes');
const questionRoutes = require('./src/routes/v1/questionRoutes');
const quizRoutes = require('./src/routes/v1/quizRoutes');
const responseRoutes = require('./src/routes/v1/responseRoutes');
const resultRoutes = require('./src/routes/v1/resultRoutes');
const roleRoutes = require('./src/routes/v1/roleRoutes');
const sessionRoutes = require('./src/routes/v1/sessionRoutes');
const userRoutes = require('./src/routes/v1/userRoutes');

// Import swagger configuration
const {swaggerUi, swaggerSpec} = require('./src/config/swagger.js');

//Configure middlewares
app.use(logger('dev'));
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Define Swagger route
app.use('/swagger-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Define principals routes 
app.use("/", rootRouter);
app.use('/v1/auth', authenticationRoutes);
app.use('/v1/clickers', clickerRoutes);
app.use('/v1/difficulties', difficultyRoutes);
app.use('/v1/questions', questionRoutes);
app.use('/v1/quizzes', quizRoutes);
app.use('/v1/responses', responseRoutes);
app.use('/v1/results', resultRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/sessions', sessionRoutes);
app.use('/v1/users', userRoutes);

//Manages errors
//Catch 404 and foward to error handler
app.use((req, res, next) => {
    next(createError(404))
});

//Error handler
app.use((err, req, res, next) => {
    //set locals, only error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.error(err.stack);
    res.status(err.status || 500).send({message: err.message || 'Initial Server Error' });
});

module.exports = app