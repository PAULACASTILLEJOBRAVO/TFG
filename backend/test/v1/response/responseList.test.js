const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Session = require('../../../src/models/Session');
const Course = require('../../../src/models/Course');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');
const Response = require('../../../src/models/Response');
const responseServices = require('../../../src/services/v1/responseServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/responses', () => {

    // First, create a teacher, a student, a course, a quiz, a session, a question and some responses in the database
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

        const responses = [
            {
                answer: '4',
                isCorrect: true,
                timeTaken: 25,
                pointsAwarded: 10,
                playerId: student._id,
                sessionId: sessions._id,
                questionId: question._id,
                attemptNumber: 2,
                isFirstAttempt: false,
                isFinalAttempt: true
            },
            {
                answer: '3',
                isCorrect: false,
                timeTaken: 17,
                pointsAwarded: 0,
                playerId: student._id,
                sessionId: sessions._id,
                questionId: question._id,
                attemptNumber: 1,
                isFirstAttempt: true,
                isFinalAttempt: false
            },
        ];

        await Response.insertMany(responses);
    });

    it('200 - should return all responses', async () => {
        const response = await request(app)
            .get('/v1/responses')
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Responses fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0]).toHaveProperty('answer', '4');
        expect(response.body.data[1]).toHaveProperty('answer', '3');
    });

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(responseServices, 'getAllResponses').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/responses');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching responses');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        responseServices.getAllResponses.mockRestore();
    });
});


describe('GET /v1/responses/:id', () => {

    let responseId;

    // First, create a teacher, a student, a course, a quiz, a session, a question and some responses in the database
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

        const response = {
            _id: '609e129e1c4ae12f34567896',
            answer: '4',
            isCorrect: true,
            timeTaken: 25,
            pointsAwarded: 10,
            playerId: student._id,
            sessionId: sessions._id,
            questionId: question._id,
            attemptNumber: 2,
            isFirstAttempt: false,
            isFinalAttempt: true
        };


        responseId = response._id;
        await Response.insertOne(response);
    });

    it('200 - should return the response by ID', async () => {
        const response = await request(app)
            .get(`/v1/responses/${responseId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Response fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data._id).toBe(responseId);
    })

    it('404 - should return 404 if response not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/responses/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Response not found');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(responseServices, 'getResponseById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/responses/${responseId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching response');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        responseServices.getResponseById.mockRestore();
    });

});