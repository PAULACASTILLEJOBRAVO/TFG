const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const userServices = require('../../../src/services/v1/userServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let userAdmin, users, user, userId;
let adminToken;

beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    userAdmin = await User.create({
        username: 'admin',
        email: 'admin@test.com',
        password: '547638',
        role: 'admin',
        status: 'active'
    });

    const resAdmin = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'admin@test.com',
            password: '547638'
        });


    adminToken = resAdmin.body.data.token;

    users = [
        {
            username: 'student1',
            email: 'student1@test.com',
            password: '987654',
            role: 'student',
            status: 'active'
        },
        {
            username: 'teacher1',
            email: 'teacher1@test.com',
            password: '123456',
            role: 'teacher',
            status: 'active'
        }
    ];

    await User.insertMany(users);

    user = new User({
        username: 'student2',
        email: 'student2@test.com',
        password: '987012',
    });

    userId = user._id;
    await User.create(user);
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('GET /v1/users', () => {

    it('200 - should return all users', async () => {
        const response = await request(app)
            .get('/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Users fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(4); // 2 from users + admin + user from beforeEach
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .get('/v1/users');

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .get('/v1/users')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'getAllUsers').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/users')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching users');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.getAllUsers.mockRestore();
    });

});

describe('GET /v1/users/me', () => {
    it('200 - should return a users by ID', async () => {
        const response = await request(app)
            .get(`/v1/users/me`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User fetched successfully');
        expect(response.body).toHaveProperty('data');
    });

        it('401 - should fail without token', async () => {
        const response = await request(app)
            .get(`/v1/users/me`);

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .get(`/v1/users/me`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    it('404 - should return 404 if response not found', async () => {
        // Mock the service to return null to simulate user not found
        jest.spyOn(userServices, 'getMe').mockResolvedValue(null);

        const response = await request(app)
            .get(`/v1/users/me`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');

        userServices.getMe.mockRestore();
    })

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'getMe').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get(`/v1/users/me`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.getMe.mockRestore();
    });

});