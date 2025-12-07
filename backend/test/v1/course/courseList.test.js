const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Course = require('../../../src/models/Course');
const courseServices = require('../../../src/services/v1/courseServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/courses', () => {

    // First, create a teacher and some courses in the database
    beforeEach(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        });

        const courses = [
            { 
                title: 'Course 1',
                teacherId: teacher._id,
            },
            { 
                title: 'Course 2',
                teacherId: teacher._id,
            },
            { 
                title: 'Course 3',
                teacherId: teacher._id, 
            },
        ]

        await Course.insertMany(courses);
    })

    it('200 - should return all courses', async () => {
        const response = await request(app)
            .get('/v1/courses');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Courses fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(3);
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(courseServices, 'getAllCourses').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/courses');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching courses');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        courseServices.getAllCourses.mockRestore();
    });
});

describe('GET /v1/courses/:id', () => {

    let courseId;

    // First, create a teacher and a course in the database
    beforeEach(async () => {
        const teacher = await User.create({
            _id: '609e129e1c4ae12f34567890',
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher'
        });

        const course = { 
            _id: '609e129e1c4ae12f34567893',
            title: 'Course 1',
            teacherId: teacher._id, 
        };

        courseId = course._id.toString();
        await Course.insertOne(course);
    })

    it('200 - should return the course by ID', async () => {
        const response = await request(app)
            .get(`/v1/courses/${courseId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Course fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.title).toBe('Course 1');
        expect(response.body.data._id).toBe(courseId);
    })

    it('404 - should return 404 if course not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; // Example non-existent ObjectId

        const response = await request(app)
            .get(`/v1/courses/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Course not found');
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(courseServices, 'getCourseById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/courses/${courseId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching course');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        courseServices.getCourseById.mockRestore();
    });
});