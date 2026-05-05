const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');

const quizServices = require('../../../src/services/v1/quizServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let teacher, quizId, quiz, students, question;
let teacherToken;

beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    teacher = await User.create({
        username: 'teacher1',
        email: 'teacher1@test.com',
        password: '123456',
        role: 'teacher',
        status: 'active'
    });

    const resTeacher = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'teacher1@test.com',
            password: '123456'
        });

    teacherToken = resTeacher.body.data.token;

    students = [{
        _id: '609e129e1c4ae12f34567895',
        username: 'student1',
        email: 'student1@test.com',
        password: '987654',
        role: 'student'
    },
    {
        _id: '609e129e1c4ae12f34567896',
        username: 'student2',
        email: 'student2@test.com',
        password: '987654',
        role: 'student'
    }];

    for (const student of students) { // Create students in the database through the model to ensure proper hashing and validation
        await User.create(student);
    } 
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/quizzes', () => {
    it('201 - should create a new quiz', async () => {
        const response = await request(app)
            .post('/v1/quizzes')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                quizFields: {
                    title: 'Quiz 1',
                    creatorId: teacher._id.toString(),
                    status: 'draft',
                    difficulty: 'easy',
                    playerIds: students.map(s => s._id.toString())
                },
                questions: [
                    {
                        text: 'What is 2 + 2?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            {text: '3', isCorrect: false}, 
                            {text: '4', isCorrect: true}, 
                            {text: '5', isCorrect: false}, 
                            {text: '6', isCorrect: false}
                        ]
                    },
                    {
                        text: 'What is the capital of France?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            { text: 'Berlin', isCorrect: false},
                            { text: 'Madrid', isCorrect: false },
                            { text: 'Paris', isCorrect: true},
                            { text: 'Rome', isCorrect: false }
                        ]
                    }
                ]
            });
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz created successfully');
        expect(response.body).toHaveProperty('data');
    })

    it('401 - should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post(`/v1/quizzes`)
            .send({
                quizFields: {
                    title: 'Quiz 1',
                    creatorId: teacher._id.toString(),
                    status: 'draft',
                    difficulty: 'easy',
                    playerIds: students.map(s => s._id.toString())
                },
                questions: [
                    {
                        text: 'What is 2 + 2?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            {text: '3', isCorrect: false}, 
                            {text: '4', isCorrect: true}, 
                            {text: '5', isCorrect: false}, 
                            {text: '6', isCorrect: false}
                        ]
                    },
                    {
                        text: 'What is the capital of France?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            { text: 'Berlin', isCorrect: false},
                            { text: 'Madrid', isCorrect: false },
                            { text: 'Paris', isCorrect: true},
                            { text: 'Rome', isCorrect: false }
                        ]
                    }
                ]
            });
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('No token provided');
    })

    it('401 - should return 401 if token is invalid', async () => {
        const response = await request(app)
            .post(`/v1/quizzes`)
            .set('Authorization', 'Bearer invalidtoken')
            .send({
                quizFields: {
                    title: 'Quiz 1',
                    creatorId: teacher._id.toString(),
                    status: 'draft',
                    difficulty: 'easy',
                    playerIds: students.map(s => s._id.toString())
                },
                questions: [
                    {
                        text: 'What is 2 + 2?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            {text: '3', isCorrect: false}, 
                            {text: '4', isCorrect: true}, 
                            {text: '5', isCorrect: false}, 
                            {text: '6', isCorrect: false}
                        ]
                    },
                    {
                        text: 'What is the capital of France?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            { text: 'Berlin', isCorrect: false},
                            { text: 'Madrid', isCorrect: false },
                            { text: 'Paris', isCorrect: true},
                            { text: 'Rome', isCorrect: false }
                        ]
                    }
                ]
            });
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid or expired token');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'createQuiz').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post(`/v1/quizzes`)
            .set('Authorization', `Bearer ${teacherToken}`)
                        .send({
                quizFields: {
                    title: 'Quiz 1',
                    creatorId: teacher._id.toString(),
                    status: 'draft',
                    difficulty: 'easy',
                    playerIds: students.map(s => s._id.toString())
                },
                questions: [
                    {
                        text: 'What is 2 + 2?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            {text: '3', isCorrect: false}, 
                            {text: '4', isCorrect: true}, 
                            {text: '5', isCorrect: false}, 
                            {text: '6', isCorrect: false}
                        ]
                    },
                    {
                        text: 'What is the capital of France?',
                        type: 'multiple-choice',
                        points: 5,
                        timeLimit: 30,
                        options: [
                            { text: 'Berlin', isCorrect: false },
                            { text: 'Madrid', isCorrect: false },
                            { text: 'Paris', isCorrect: true },
                            { text: 'Rome', isCorrect: false }
                        ]
                    }
                ]
            });
            
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error creating quiz');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.createQuiz.mockRestore();
    });
});