const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');
const Session = require('../../../src/models/Session');
const Clicker = require('../../../src/models/Clicker');

const sessionServices = require('../../../src/services/v1/sessionServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Initialize variables to be used across tests
let admin, teacher, student, clicker, quiz, session, question;
let teacherToken;

// Before each test, stop the in-memory MongoDB instance
beforeEach(async () => { 
    await clearDatabase();

    teacher = await User.create({
        _id: '609e129e1c4ae12f34567890',
        username: 'teacher1',
        email: 'teacher1@test.com',
        password: '456123',
        role: 'teacher',
        status: 'active'
    });

    const resTeacher = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'teacher1@test.com',
            password: '456123'
        });

    teacherToken = resTeacher.body.data.token;

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
        role: 'student'
    });

    clicker = await Clicker.create({
        _id: '609e129e1c4ae12f34567893',
        deviceCode: '0x0012',
        assignedToUserId: student._id.toString(),
        status: 'assigned',
        adminId: admin._id.toString()
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
});

// After each test, clear the database
afterAll(async () => { await clearDatabase(); });

describe('POST /v1/sessions', () => {
    it('201 - should create a new session', async () => {
        const response = await request(app)
            .post('/v1/sessions')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                quizId: quiz._id.toString(),
                teacherId: teacher._id.toString(),
                deviceIds: [clicker._id.toString()],
                startTime: new Date(),
                status: 'active'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Session created successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(sessionServices, 'createSession').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/v1/sessions')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                quizId: quiz._id.toString(),
                teacherId: teacher._id.toString(),
                deviceIds: [clicker._id.toString()],
                startTime: new Date(),
                status: 'active'
            });
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error creating session');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        sessionServices.createSession.mockRestore();
    });
});