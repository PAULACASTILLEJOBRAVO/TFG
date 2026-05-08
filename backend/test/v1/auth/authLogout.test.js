const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const jwt = require('jsonwebtoken');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let user;
let userToken;

beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    user = await User.create({ 
        username: 'user1',
        email: 'user1@test.com',
        password: '547638'
    });

    const resUser = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'user1@test.com',
            password: '547638'
        });

    userToken = resUser.body.data.token;

});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/auth/logout', () => {
    it('200 - should logout successfully', async () => {
        const response = await request(app)
            .post('/v1/auth/logout')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });

    it('401 - should fail logout with unauthorized token', async () => {
        const response = await request(app)
            .post('/v1/auth/logout')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid or expired token');
    });

    it('401 - should fail logout with expired token', async () => {
        const expiredToken = jwt.sign(
            { 
                _id: user._id,
                username: user.username,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: -1 
            } // Set token to expire immediately
        );

        const response = await request(app)
            .post('/v1/auth/logout')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid or expired token');
    });

    it('500 - should fail logout with database error', async () => {
        // Mock the User.findById method to throw an error
        jest.spyOn(User.prototype, 'markOffline').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .post('/v1/auth/logout')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error logging out user');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        User.prototype.markOffline.mockRestore();
    });
});