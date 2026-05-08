const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const authenticationService = require('../../../src/services/v1/authenticationService');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/auth/register', () => {
    it('201 - should register successfully with valid data', async () => {
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user1',
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('data');
    });

    it('409 - should fail to register with existing email', async () => {
        // First, register a user
        await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user1',
                email: 'user1@test.com',
                password: '547638'
            });

        // Then, try to register another user with the same email
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user2',
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('The user already exists');
    });

    it('400 - should fail to register with missing email', async () => {
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user1',
                password: '547638'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username, email and password are required');
    });

    it('400 - should fail to register with missing username', async () => {
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username, email and password are required');
    });

    it('400 - should fail to register with missing password', async () => {
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user1',
                email: 'user1@test.com'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username, email and password are required');
    });

    it('500 - should fail to register with database error', async () => {
        // Mock the User.create method to throw an error
        jest.spyOn(authenticationService, 'registerUser').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                username: 'user1',
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error registering user');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        authenticationService.registerUser.mockRestore();
    });
});