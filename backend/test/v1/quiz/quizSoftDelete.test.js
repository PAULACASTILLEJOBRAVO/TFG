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

    const quiz = await Quiz.create({ 
            _id: '609e129e1c4ae12f34567897',
            title: 'Quiz 1',
            creatorId: teacher._id.toString(),
            status: 'published',
            difficulty: 'easy',
            playerIds: students.map(s => s._id.toString())
        });

    quizId = quiz._id.toString();
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('DELETE /v1/quizzes/:id', () => {
    it('200 - should soft delete a quiz', async () => {
        const response = await request(app)
            .delete(`/v1/quizzes/${quizId}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz deleted successfully');
    })

    it('401 - should return 401 if no token is provided', async () => {
        const response = await request(app)
            .delete(`/v1/quizzes/${quizId}`)
            
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('No token provided');
    })

    it('401 - should return 401 if token is invalid', async () => {
        const response = await request(app)
            .delete(`/v1/quizzes/${quizId}`)
            .set('Authorization', 'Bearer invalidtoken')
            
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid or expired token');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'deleteQuizById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .delete(`/v1/quizzes/${quizId}`)
            .set('Authorization', `Bearer ${teacherToken}`);
            
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error deleting quiz');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.deleteQuizById.mockRestore();
    });
});