const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const userServices = require('../../../src/services/v1/userServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let userAdmin, user, userId;
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

    user = new User({
        username: 'student2',
        email: 'student2@test.com',
        password: '987012',
        role: 'student',
        status: 'active'
    });

    userId = user._id;
    await User.create(user);
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('DELETE /v1/users/:id', () => {
    it('200 - should delete an user', async () => {
        const response = await request(app)
            .delete(`/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User permanently deleted successfully');
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .delete(`/v1/users/${userId}`);

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .delete(`/v1/users/${userId}`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    
    it('400 - should return 400 if User ID is incorrect', async () => {
        const response = await request(app)
            .delete(`/v1/users/invalid-id`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User ID is incorrect');
    });

    it('404 - should return 404 if user not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899';

        const response = await request(app)
            .delete(`/v1/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'deleteUserPermanentlyById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .delete(`/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error permanently deleting user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.deleteUserPermanentlyById.mockRestore();
    });

});