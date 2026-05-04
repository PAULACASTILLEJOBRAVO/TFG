const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const userServices = require('../../../src/services/v1/userServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let admin, validUsers;
let adminToken;

beforeEach(async () => {
    await clearDatabase(); // Clear the database before each test

    admin = await User.create({
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

    validUsers = [{
        username: 'student1',
        email: 'student@test.com',
        password: '547638',
        role: 'student',
        status: 'active'
    },
    {
        username: 'student2',
        email: 'student2@test.com',
        password: '547638',
        role: 'student',
        status: 'active'
    },
    {
        username: 'teacher1',
        email: 'teacher@test.com',
        password: '547638',
        role: 'teacher',
        status: 'active',
        isOnline: true
    },
    {
        username: 'teacher2',
        email: 'teacher2@test.com',
        password: '547638',
        role: 'teacher',
        status: 'inactive'
    }];

    await User.insertMany(validUsers);
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('GET /v1/users/stats', () => {
    it('200 - should return total users\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/users/stats')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Users' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(userServices, 'getTotalUsersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/users/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching users' stats");
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        userServices.getTotalUsersStats.mockRestore();
    });

});

describe('GET /v1/users/stats/active', () => {
    it('200 - should return active users\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/users/stats/active')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Active users' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(userServices, 'getActiveUsersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/users/stats/active')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching active users' stats");
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        userServices.getActiveUsersStats.mockRestore();
    });

});

describe('GET /v1/users/stats/connected', () => {
    it('200 - should return connected users\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/users/stats/connected')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Connected users' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(userServices, 'getConnectedUsersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/users/stats/connected')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error fetching connected users\' stats');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        userServices.getConnectedUsersStats.mockRestore();
    });

});

describe('GET /v1/users/stats/archived', () => {
    it('200 - should return archived users\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/users/stats/archived')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Archived users' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(userServices, 'getArchivedUsersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/users/stats/archived')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error fetching archived users\' stats');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        userServices.getArchivedUsersStats.mockRestore();
    });

});