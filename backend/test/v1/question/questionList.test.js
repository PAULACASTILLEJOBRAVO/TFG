const request = require('supertest');
const app = require('../../../app'); 
const Question = require('../../../src/models/Question');
const questionServices = require('../../../src/services/v1/questionServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');


// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/questions', () => {

    // First, create some questions in the database
    beforeAll(async () => {
        const questions = [
            {
                text: "A prime number has exactly two divisors, 1 and itself",
                type: "true-false",
                options: [
                    {
                        text: 'True',
                        isCorrect: true,
                        order: 0
                    }, 
                    {
                        text: 'False',
                        isCorrect: false,
                        order: 1
                    }
                ],
                correctOption: 0,
            },
            {
                text: "The square root of 64 is 6",
                type: "true-false",
                options: [
                    {
                        text: 'True',
                        isCorrect: false,
                        order: 0,
                        feedback: "Wrong! It's 8."
                    }, 
                    {
                        text: 'False',
                        isCorrect: true,
                        order: 1,
                        feedback: "Correct! It's 8."
                    }
                ],
                correctOption: 1,

            },
            {
                text: "What is 2 + 2?",
                type: "multiple-choice",
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
                correctOption: 1
            }
        ];

        await Question.insertMany(questions);

    });

    it('200 - should return all questions', async () => {
        const response = await request(app)
            .get('/v1/questions')
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Questions fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(3);
    });

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(questionServices, 'getAllQuestions').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/questions');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching questions');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        questionServices.getAllQuestions.mockRestore();
    });

});

describe('GET /v1/questions', () => {

    let questionId;

    // First, create some questions in the database
    beforeAll(async () => {
        const question = new Question({
            _id: "609e129e1c4ae12f34567849",
            text: "The square root of 64 is 6",
            type: "true-false",
            options: [
                {
                    text: 'True',
                    isCorrect: false,
                    order: 0,
                    feedback: "Wrong! It's 8."
                }, 
                {
                    text: 'False',
                    isCorrect: true,
                    order: 1,
                    feedback: "Correct! It's 8."
                }
            ],
            correctOption: 1,
        });

        questionId = question._id;
        await Question.insertOne(question);

    });

    it('200 - should return a questions by ID', async () => {
        const response = await request(app)
            .get(`/v1/questions/${questionId}`)
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Question fetched successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('404 - should return 404 if response not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/questions/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Question not found');
    })

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(questionServices, 'getQuestionById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/questions/${questionId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching question');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        questionServices.getQuestionById.mockRestore();
    });

});