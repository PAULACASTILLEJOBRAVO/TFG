const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let user;

beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    user = await User.create({ 
        username: 'user1',
        email: 'user1@test.com',
        password: '547638'
    });

});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/auth/login', () => {
    it('200 - should login successfully with correct credentials', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('token');
    });

    it('401 - should fail login with incorrect password', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'user1@test.com',
                password: 'incorrectpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid password');
    });

    it('404 - should fail login with non-existent email', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'nonexistent@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('User does not exist');
    });

    it('403 - should fail login with inactive user', async () => {
        // Set user status to inactive
        user.status = 'inactive';
        await user.save();

        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('User account is not active');
    });

    it('400 - should fail login with missing email', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                password: '547638'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    it('400 - should fail login with missing password', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'user1@test.com'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    it('500 - should fail login with database error', async () => {
        // Mock the User.findById method to throw an error
        jest.spyOn(User.prototype, 'markOnline').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'user1@test.com',
                password: '547638'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error logging in user');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        User.prototype.markOnline.mockRestore();
    });
});