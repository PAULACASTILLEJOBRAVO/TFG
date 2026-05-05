const request = require('supertest');
const app = require('../../../app'); 

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Import necessary models and services
const User = require('../../../src/models/User');
const Session = require('../../../src/models/Session');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');
const Response = require('../../../src/models/Response');
const Clicker = require('../../../src/models/Clicker');

const responseServices = require('../../../src/services/v1/responseServices');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Initialize variables to be used across tests
let admin, teacher, student, clicker, quiz, session, question;
let teacherToken;

// Before each test, clear the database and set up necessary data
beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    // Create a teacher and get an authentication token
    teacher = await User.create({
        _id: '609e129e1c4ae12f34567890',
        username: 'teacher1',
        email: 'teacher1@test.com',
        password: '456123',
        status: 'active',
        role: 'teacher'
    });

    const resTeacher = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'teacher1@test.com',
            password: '456123'
        });

    teacherToken = resTeacher.body.data.token;

    // Then, create an admin, a student, a quiz, a clicker, a session and a question
    admin = await User.create({
        username: 'admin',
        email: 'admin@test.com',
        password: '123456',
        status: 'active',
        role: 'admin'
    });

    student = await User.create({
        _id: '609e129e1c4ae12f34567895',
        username: 'student1',
        email: 'student1@test.com',
        password: '987654',
        status: 'active',
        role: 'student'
    });

    clicker = await Clicker.create({
        _id: '609e129e1c4ae12f34567896',
        deviceCode: '0x0012',
        assignedToUserId: student._id.toString(),
        adminId: admin._id.toString(),
        status: 'assigned'
    });

    question = await Question.create({
        _id: '609e129e1c4ae12f34567894',
        text: 'What is 2 + 2?',
        type: 'multiple-choice',
        options: [
            {
                text: '3',
                isCorrect: false,
                letter: 'A'
            }, 
            {
                text: '4',
                isCorrect: true,
                letter: 'B'
            }, 
            {
                text: '5',
                isCorrect: false,
                letter: 'C'
            }, 
            {
                text: '6',
                isCorrect: false,
                letter: 'D'
            }
        ]
    });

    quiz = await Quiz.create({ 
        _id: '609e129e1c4ae12f34567892',
        title: 'Quiz 1',
        creatorId: teacher._id.toString(),
        questionIds: [question._id.toString()],
        playerIds: [student._id.toString()],
        status: 'published',
        difficulty: 'easy'
    });

    session = await Session.create({
        _id: '609e129e1c4ae12f34567893',
        quizId: quiz._id.toString(),
        teacherId: teacher._id.toString(),
        deviceIds: [clicker._id.toString()],
        status: 'active',
        questions: [{
            originalQuestionId: question._id.toString(),
            questionSnapshot: {
                text: question.text,
                type: question.type,
                options: question.options
            },
            answers: [],
            totalResponses: 0
        }]
    });
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/responses', () => {
    it('200 - should create a new response', async () => {
        const newResponse = {
            answer: 'B',
            deviceId: clicker.deviceCode,
            sessionId: session._id.toString(),
            questionId: question._id.toString(),
        }

        const response = await request(app)
            .post('/v1/responses')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send(newResponse)
            .expect(201);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Response created successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('answer', 'B');
    });

    it('500 - should return 500 if there is a server error', async () => {
        const newResponse = {
            answer: 'B',
            deviceId: clicker.deviceCode,
            sessionId: session._id.toString(),
            questionId: question._id.toString(),
        }

        // Mock the service to throw an error
        jest.spyOn(responseServices, 'createResponse').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/v1/responses')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send(newResponse)
            .expect(500);
        
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error creating response');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        responseServices.createResponse.mockRestore();
    });
});