//Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');

//Configure debug
const debug = require('debug')('backend:app');

//Configure enviroment variables
dotenv.config();

//Configure Express
const app = express();

//Import routes
const rootRouter = require('./src/routes/root');
const courseRoutes = require('./src/routes/v1/courseRoutes');
const questionRoutes = require('./src/routes/v1/questionRoutes');
const quizRoutes = require('./src/routes/v1/quizRoutes');
const responseRoutes = require('./src/routes/v1/responseRoutes');
const resultRoutes = require('./src/routes/v1/resultRoutes');
const sessionRoutes = require('./src/routes/v1/sessionRoutes');
const userRoutes = require('./src/routes/v1/userRoutes');

//Connect to database
mongoose.connect(process.env.MONGO_URI).then(() => {
    debug('MongoDB connected!');
}).catch(err => {
    debug(Error,'Error connecting to database! \n', err);
});

//Configure middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/public')));

//Define principals routes 
app.use("/", rootRouter);
app.use('/v1/courses', courseRoutes);
app.use('/v1/questions', questionRoutes);
app.use('/v1/quizzes', quizRoutes);
app.use('/v1/responses', responseRoutes);
app.use('/v1/results', resultRoutes);
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
    res.status(err.status || 500).send({message: 'Server Error!', error: err.message});
});

module.exports = app