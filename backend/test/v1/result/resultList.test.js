const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Session = require('../../../src/models/Session');
const Course = require('../../../src/models/Course');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');
const Result = require('../../../src/models/Result');
const resultServices = require('../../../src/services/v1/resultServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/results', () => {

    // First, create a teacher, a student, a course, a quiz, a session, a question and some results in the database
    beforeAll(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        }); 

        const student = await User.create({
            _id: '609e129e1c4ae12f34567895',
            username: 'student1',
            email: 'student1@test.com',
            password: '987654',
            role: 'student'
        });

        const course = await Course.create({ 
            _id: '609e129e1c4ae12f34567891',
            title: 'Course 1',
            teacherId: teacher._id, 
        });

        const quiz = await Quiz.create({ 
            _id: '609e129e1c4ae12f34567892',
            title: 'Quiz 1',
            creatorId: teacher._id,
            courseId: course._id
        });

        const sessions = await Session.create({
            _id: '609e129e1c4ae12f34567893',
            quizId: quiz._id,
            teacherId: teacher._id,
            courseId: course._id,
        });

        const question = await Question.create({
            _id: '609e129e1c4ae12f34567894',
            text: 'What is 2 + 2?',
            type: 'multiple-choice',
            options: [
                {
                    text: '3',
                    isCorrect: false,
                    order: 0
                }, 
                {
                    text: '4',
                    isCorrect: true,
                    order: 1
                }, 
                {
                    text: '5',
                    isCorrect: false,
                    order: 2
                }, 
                {
                    text: '6',
                    isCorrect: false,
                    order: 3
                }
            ],
            correctOption: 1,
        });

        const results = [
            {
                totalScore: 20,
                correctAnswers: 2,
                wrongAnswers: 3,
                unansweredQuestions: 1,
                totalQuestions: 6,
                rank: 5,
                timeTaken: 75,
                playerId: student._id,
                sessionId: sessions._id,
                quizId: quiz._id,
                finishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7))
            },
            {
                
                totalScore: 30,
                correctAnswers: 3,
                wrongAnswers: 0,
                unansweredQuestions: 0,
                totalQuestions: 3,
                rank: 1,
                timeTaken: 18,
                playerId: student._id,
                sessionId: sessions._id,
                quizId: quiz._id,
                finishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7))
            },
        ];

        await Result.insertMany(results);
    });

    it('200 - should return all results', async () => {
        const response = await request(app)
            .get('/v1/results')
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Results fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(2);
    });

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(resultServices, 'getAllResults').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/results');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching results');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        resultServices.getAllResults.mockRestore();
    });
});

describe('GET /v1/results/:id', () => {

    let resultId;

    // First, create a teacher, a student, a course, a quiz, a session, a question and some results in the database
    beforeAll(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        }); 

        const student = await User.create({
            _id: '609e129e1c4ae12f34567895',
            username: 'student1',
            email: 'student1@test.com',
            password: '987654',
            role: 'student'
        });

        const course = await Course.create({ 
            _id: '609e129e1c4ae12f34567891',
            title: 'Course 1',
            teacherId: teacher._id, 
        });

        const quiz = await Quiz.create({ 
            _id: '609e129e1c4ae12f34567892',
            title: 'Quiz 1',
            creatorId: teacher._id,
            courseId: course._id
        });

        const sessions = await Session.create({
            _id: '609e129e1c4ae12f34567893',
            quizId: quiz._id,
            teacherId: teacher._id,
            courseId: course._id,
        });

        const question = await Question.create({
            _id: '609e129e1c4ae12f34567894',
            text: 'What is 2 + 2?',
            type: 'multiple-choice',
            options: [
                {
                    text: '3',
                    isCorrect: false,
                    order: 0
                }, 
                {
                    text: '4',
                    isCorrect: true,
                    order: 1
                }, 
                {
                    text: '5',
                    isCorrect: false,
                    order: 2
                }, 
                {
                    text: '6',
                    isCorrect: false,
                    order: 3
                }
            ],
            correctOption: 1,
        });

        const result =  { 
            _id: '609e129e1c4ae12f34567896',
            totalScore: 30,
            correctAnswers: 3,
            wrongAnswers: 0,
            unansweredQuestions: 0,
            totalQuestions: 3,
            rank: 1,
            timeTaken: 18,
            playerId: student._id,
            sessionId: sessions._id,
            quizId: quiz._id,
            finishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7))
        };


        resultId = result._id;
        await Result.insertOne(result);
    });

    it('200 - should return the result by ID', async () => {
        const response = await request(app)
            .get(`/v1/results/${resultId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Result fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data._id).toBe(resultId);
    })

    it('404 - should return 404 if result not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/results/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Result not found');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(resultServices, 'getResultById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/results/${resultId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching result');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        resultServices.getResultById.mockRestore();
    });

});