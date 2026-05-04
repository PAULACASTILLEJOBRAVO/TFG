const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Quiz = require('../../../src/models/Quiz');
const Question = require('../../../src/models/Question');
const Clicker = require('../../../src/models/Clicker');
const Session = require('../../../src/models/Session');
const Response = require('../../../src/models/Response');
const Result = require('../../../src/models/Result');

const quizServices = require('../../../src/services/v1/quizServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let teacher, quizId, quiz, students, question, admin, clicker, session, response, result;
let teacherToken, studentToken;

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

    const resStudent = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'student1@test.com',
            password: '987654'
        });

    studentToken = resStudent.body.data.token;

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

    const quizzes = [
        { 
            _id: '609e129e1c4ae12f34567897',
            title: 'Quiz 1',
            creatorId: teacher._id,
            status: 'published',
            difficulty: 'easy',
            playerIds: students.map(s => s._id)
        },
        { 
            _id: '609e129e1c4ae12f34567898',
            title: 'Quiz 2',
            creatorId: teacher._id,
            status: 'draft',
            difficulty: 'medium',
            questionIds: [question._id]
        },
        { 
            _id: '609e129e1c4ae12f34567899',
            title: 'Quiz 3',
            creatorId: teacher._id,
            difficulty: 'hard',
            status: 'archived',
            questionIds: [question._id],
            playerIds: students.map(s => s._id)
        },
    ];

    await Quiz.insertMany(quizzes);

    quizId = quizzes[0]._id; 

    admin = await User.create({
        username: 'admin1',
        email: 'admin@test.com',
        password: 'adminpass',
        role: 'admin',
        status: 'active'
    });

    clicker = await Clicker.create({
        adminId: admin._id,
        deviceCode: '0x0012',
        status: 'assigned',
        assignedToUserId: students[0]._id
    });

    session = await Session.create({
        quizId: quizzes[0]._id,
        teacherId: teacher._id,
        deviceIds: [clicker._id],
        status: 'completed',
        startTime: new Date(),
        endTime: new Date(),
        questions: [{
            originalQuestionId: question._id,
            questionSnapshot:{
                text: question.text,
                type: question.type,
                points: question.points,
                timeLimit: question.timeLimit,
                options: question.options
            },
            answers: [
                {
                    letter: 'B',
                    count: 1
                },
                {
                    letter: 'C',
                    count: 1
                }
            ],
            totalResponses: 2
        }],
    });

    response = await Response.create({
        sessionId: session._id,
        playerId: students[0]._id,
        questionId: question._id,
        answer: 'B',
        isCorrect: true,
        pointsAwarded: 10
    });

    result = await Result.create({
        playerId: students[0]._id,
        sessionId: session._id,
        quizSnapshot: {
            originalQuizId: quizzes[0]._id,
            title: quizzes[0].title,
            description: quizzes[0].description,
            difficulty: quizzes[0].difficulty
        },
        correctAnswers: 1,
        wrongAnswers: 0,
        unansweredQuestions: 0,
        totalQuestions: 1,
        rank: 1,
        totalScore: 10,
        timeTaken: 30,
        startedAt: session.startTime,
        finishedAt: session.endTime,
    });
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('GET /v1/quizzes/my-teacher', () => {
    it('200 - should return all quizzes for a teacher', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-teacher')
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quizzes fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(3);
    })

    it('401 - should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-teacher');
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('No token provided');
    })

    it('401 - should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-teacher')
            .set('Authorization', 'Bearer invalidtoken');
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid or expired token');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getAllQuizzesForTeacher').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/quizzes/my-teacher')
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quizzes');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getAllQuizzesForTeacher.mockRestore();
    });
});


describe('GET /v1/quizzes/my-student', () => {
    it('200 - should return all quizzes for a student', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-student')
            .set('Authorization', `Bearer ${studentToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quizzes fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1);
    })

    it('401 - should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-student');
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('No token provided');
    })

    it('401 - should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/v1/quizzes/my-student')
            .set('Authorization', 'Bearer invalidtoken');
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid or expired token');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getAllQuizzesForStudent').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/quizzes/my-student')
            .set('Authorization', `Bearer ${studentToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quizzes');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getAllQuizzesForStudent.mockRestore();
    });
});

describe('GET /v1/quizzes/:id/sessions', () => {
    it('200 - should return the quiz by ID', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/sessions`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz sessions fetched successfully');
        expect(response.body).toHaveProperty('data');
    })

    it('400 - should return 400 if quiz ID is invalid', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/invalid-id/sessions`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz ID is incorrect');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getQuizSessionsForTeacher').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/sessions`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quiz sessions');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getQuizSessionsForTeacher.mockRestore();
    });
});

describe('GET /v1/quizzes/:id/questions-analytics', () => {
    it('200 - should return the quiz by ID', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/questions-analytics`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz question analytics fetched successfully');
        expect(response.body).toHaveProperty('data');
    })

    it('400 - should return 400 if quiz ID is invalid', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/invalid-id/questions-analytics`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz ID is incorrect');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getQuizQuestionAnalytics').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/questions-analytics`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching quiz question analytics');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getQuizQuestionAnalytics.mockRestore();
    });
});

describe('GET /v1/quizzes/:id/student', () => {
    it('200 - should return the quiz by ID', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/student`)
            .set('Authorization', `Bearer ${studentToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz fetched successfully');
        expect(response.body).toHaveProperty('data');
    })

    it('400 - should return 400 if quiz ID is invalid', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/invalid-id/student`)
            .set('Authorization', `Bearer ${studentToken}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz ID is incorrect');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getQuizByIdForStudent').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/student`)
            .set('Authorization', `Bearer ${studentToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching the quiz');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getQuizByIdForStudent.mockRestore();
    });
});

describe('GET /v1/quizzes/:id/student?studentId=:studentId', () => {
    it('200 - should return the quiz by ID', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/student?studentId=${students[0]._id}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz fetched successfully');
        expect(response.body).toHaveProperty('data');
    })

    it('400 - should return 400 if quiz ID is invalid', async () => {
        const response = await request(app)
            .get(`/v1/quizzes/invalid-id/student?studentId=${students[0]._id}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Quiz ID is incorrect');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(quizServices, 'getQuizByIdForStudent').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/quizzes/${quizId}/student?studentId=${students[0]._id}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching the quiz');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        quizServices.getQuizByIdForStudent.mockRestore();
    });
});