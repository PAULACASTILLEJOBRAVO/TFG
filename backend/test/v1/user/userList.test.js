const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const userServices = require('../../../src/services/v1/userServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');


// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

// After each test, clear the database
afterEach(async () => { await clearDatabase(); });

describe('GET /v1/users', () => {

    // First, create some users in the database
    beforeAll(async () => {
        const users = [
            {
                username: 'student1',
                email: 'student1@test.com',
                password: '987654',
            },
            {
                username: 'teacher1',
                email: 'teacher1@test.com',
                password: '123456',
                role: 'teacher'
            },
            {
                username: 'admin',
                email: 'admin@test.com',
                password: '547638',
                role: 'admin'
            }
        ];

        await User.insertMany(users);

    });

    it('200 - should return all users', async () => {
        const response = await request(app)
            .get('/v1/users')
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Users fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(3);
    });

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'getAllUsers').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/users');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching users');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.getAllUsers.mockRestore();
    });

});

describe('GET /v1/users', () => {

    let userId;

    // First, create some users in the database
    beforeAll(async () => {
        const user = new User({
            username: 'student1',
            email: 'student1@test.com',
            password: '987654',
        });

        userId = user._id;
        await User.insertOne(user);

    });

    it('200 - should return a users by ID', async () => {
        const response = await request(app)
            .get(`/v1/users/${userId}`)
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User fetched successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('404 - should return 404 if response not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899'; 

        const response = await request(app)
            .get(`/v1/users/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    })

    it('500 - hould return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'getUserById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/users/${userId}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.getUserById.mockRestore();
    });

});