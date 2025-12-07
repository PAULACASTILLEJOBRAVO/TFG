const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Course = require('../../../src/models/Course');
const Quiz = require('../../../src/models/Quiz');
const Session = require('../../../src/models/Session');
const sessionServices = require('../../../src/services/v1/sessionServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/sessions', () => {

    // First, create a teacher, a student, a course, a quiz and some sessions in the database
    beforeEach(async () => {
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

        const quizzes = [
            { 
                _id: '609e129e1c4ae12f34567892',
                title: 'Quiz 1',
                creatorId: teacher._id,
                courseId: course._id
            },
            { 
                _id: '609e129e1c4ae12f34567893',
                title: 'Quiz 2',
                creatorId: teacher._id,
                courseId: course._id
            },
        ]

        const sessions = [
            {
                quizId: quizzes[0]._id,
                teacherId: teacher._id,
                courseId: course._id,
            },
            {
                quizId: quizzes[1]._id,
                teacherId: teacher._id,
                playerIds: [student._id],
                status: 'active'
            },
        ]

        await Session.insertMany(sessions);
    })

    it('200 - should return all sessions', async () => {
        const response = await request(app)
            .get('/v1/sessions');
        
            
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Sessions fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(2);
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(sessionServices, 'getAllSessions').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/sessions');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching sessions');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        sessionServices.getAllSessions.mockRestore();
    });
});

describe('GET /v1/sessions/:id', () => {

    let sessionId;

    // First, create a teacher, a student, a course, a quiz and a session in the database
    beforeEach(async () => {
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
        });

        const course = await Course.create({ 
            _id: '609e129e1c4ae12f34567892',
            title: 'Course 1',
            teacherId: teacher._id, 
        });

        const quiz = { 
            _id: '609e129e1c4ae12f34567893',
            title: 'Quiz 1',
            courseId: course._id,
            creatorId: teacher._id, 
        };

        const session = {
            _id: '609e129e1c4ae12f34567894',
            quizId: quiz._id,
            teacherId: teacher._id,
            playerIds: [student._id],
            status: 'pending'
        };

        sessionId = session._id.toString();
        await Session.insertOne(session);
    })

    it('200 - should return the session by ID', async () => {
        const response = await request(app)
            .get(`/v1/sessions/${sessionId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Session fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data._id).toBe(sessionId);
    })

    it('404 - should return 404 if session not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/sessions/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Session not found');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(sessionServices, 'getSessionById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/sessions/${sessionId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching session');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        sessionServices.getSessionById.mockRestore();
    });
});