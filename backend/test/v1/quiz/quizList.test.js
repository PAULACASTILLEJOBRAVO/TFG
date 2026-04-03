const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Quiz = require('../../../src/models/Quiz');
const quizServices = require('../../../src/services/v1/quizServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/quizzes', () => {

    // First, create a teacher and some quizzes in the database
    beforeEach(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        });

        const quizzes = [
            { 
                title: 'Quiz 1',
                creatorId: teacher._id
            },
            { 
                title: 'Quiz 2',
                creatorId: teacher._id
            },
            { 
                title: 'Quiz 3',
                creatorId: teacher._id
            },
        ]

        await Quiz.insertMany(quizzes);
    })

    it('200 - should return all quizzes', async () => {
        const response = await request(app)
            .get('/v1/quizzes');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quizzes fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(3);
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getAllQuizzes').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/quizzes');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quizzes');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getAllQuizzes.mockRestore();
    });
});

describe('GET /v1/quizzes/:id', () => {

    let quizId;

    // First, create a teacher and a quiz in the database
    beforeEach(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        });

        const quiz = { 
            _id: '609e129e1c4ae12f34567893',
            title: 'Quiz 1',
            creatorId: teacher._id, 
        };

        quizId = quiz._id.toString();
        await Quiz.insertOne(quiz);
    })

    it('200 - should return the quiz by ID', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/${quizId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.title).toBe('Quiz 1');
        expect(response.body.data._id).toBe(quizId);
    })

    it('404 - should return 404 if quiz not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/quizzes/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz not found');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getQuizById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/quizzes/${quizId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quiz');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getQuizById.mockRestore();
    });
});