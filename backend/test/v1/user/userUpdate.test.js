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


    user = await User.create({
        username: 'student2',
        email: 'student2@test.com',
        password: '987012',
        role: 'student',
        status: 'active'
    });

    userId = user._id.toString();
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('PATCH /v1/users/:id/password', () => {

    it('200 - should change user password', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                oldPassword: '987012',
                newPassword: 'newpassword123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User password updated successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/password`)
            .send({
                oldPassword: '987012',
                newPassword: 'newpassword123'
            });

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/password`)
            .set('Authorization', 'Bearer invalidtoken')
            .send({
                oldPassword: '987012',
                newPassword: 'newpassword123'
            });

        expect(response.statusCode).toBe(401);
    });

    it('400 - should return 400 if old password is incorrect', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                oldPassword: '987012',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('New password is required');
    });

    it('404 - should return 404 if user not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899';

        const response = await request(app)
            .patch(`/v1/users/${nonExistentId}/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                oldPassword: '987012',
                newPassword: 'newpassword123'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'updatePasswordById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .patch(`/v1/users/${userId}/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                oldPassword: '987012',
                newPassword: 'newpassword123'
            });
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error updating user password');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.updatePasswordById.mockRestore();
    });

});

describe('PATCH /v1/users/:id/restore', () => {
    it('200 - should restore an user', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/restore`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User restored successfully');
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/restore`);

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/restore`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    
    it('400 - should return 400 if User ID is incorrect', async () => {
        const response = await request(app)
            .patch(`/v1/users/invalid-id/restore`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User ID is incorrect');
    });

    it('404 - should return 404 if user not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899';

        const response = await request(app)
            .patch(`/v1/users/${nonExistentId}/restore`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'restoreUserById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .patch(`/v1/users/${userId}/restore`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error restoring user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.restoreUserById.mockRestore();
    });

});

describe('PATCH /v1/users/:id/archive', () => {
    it('200 - should archive an user', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/archive`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User archived successfully');
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/archive`);

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}/archive`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    
    it('400 - should return 400 if User ID is incorrect', async () => {
        const response = await request(app)
            .patch(`/v1/users/invalid-id/archive`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User ID is incorrect');
    });

    it('404 - should return 404 if user not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899';

        const response = await request(app)
            .patch(`/v1/users/${nonExistentId}/archive`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'archiveUserById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .patch(`/v1/users/${userId}/archive`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error archiving user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.archiveUserById.mockRestore();
    });

});

describe('PATCH /v1/users/:id', () => {
    it('200 - should update an user', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                isOnline: true,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}`)
            .send({
                isOnline: true,
            });

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .patch(`/v1/users/${userId}`)
            .set('Authorization', 'Bearer invalidtoken')
            .send({
                isOnline: true,
            });

        expect(response.statusCode).toBe(401);
    });

    it('400 - should return 400 if request is invalid', async () => {
        const response = await request(app)
            .patch(`/v1/users/invalid-id`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Body is required');
    });

    it('404 - should return 404 if user not found', async () => {
        const nonExistentId = '609e129e1c4ae12f34567899';
        
        const response = await request(app)
            .patch(`/v1/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
               username: 'newusername'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User not found');
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(userServices, 'updateUserById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .patch(`/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                role: 'teacher',
            });
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error updating user');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        userServices.updateUserById.mockRestore();
    });

});