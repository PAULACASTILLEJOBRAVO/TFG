const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Clicker = require('../../../src/models/Clicker');
const clickerServices = require('../../../src/services/v1/clickerServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let admin, validClickers, student;
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

    student = await User.create({
        username: 'student1',
        email: 'student@test.com',
        password: '547638',
        role: 'student',
        status: 'active'
    });


    validClickers = [{
        deviceCode: '0x0001',
        status: 'assigned',
        assignedToUserId: student._id.toString(),
        createdBy: admin._id
    },
    {
        deviceCode: '0x0002',
        status: 'available',
        createdBy: admin._id
    },
    {
        deviceCode: '0x0003',
        status: 'damaged',
        createdBy: admin._id
    },
    {
        deviceCode: '0x0004',
        status: 'retired',
        createdBy: admin._id
    }];

    await Clicker.insertMany(validClickers);

});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('GET /v1/clickers/stats', () => {
    it('200 - should return total users\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/clickers/stats')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Clickers' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'getTotalClickersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/clickers/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching clickers' stats");
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.getTotalClickersStats.mockRestore();
    });

});

describe('GET /v1/clickers/stats/active-clickers', () => {
    it('200 - should return active clickers\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/clickers/stats/active-clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Active clickers' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'getActiveClickersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/clickers/stats/active-clickers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching active clickers' stats");
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.getActiveClickersStats.mockRestore();
    });

});

describe('GET /v1/clickers/stats/available-clickers', () => {
    it('200 - should return available clickers\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/clickers/stats/available-clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Available clickers' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'getAvailableClickersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/clickers/stats/available-clickers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching available clickers' stats");
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.getAvailableClickersStats.mockRestore();
    });

});

describe('GET /v1/clickers/stats/in-use-clickers', () => {
    it('200 - should return connected clickers\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/clickers/stats/in-use-clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("In use clickers' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'getInUseClickersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/clickers/stats/in-use-clickers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error fetching in use clickers\' stats');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.getInUseClickersStats.mockRestore();
    });

});

describe('GET /v1/clickers/stats/inactive-clickers', () => {
    it('200 - should return inactive clickers\' stats', async () => {
        const newUser = await request(app)
            .get('/v1/clickers/stats/inactive-clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(newUser.statusCode).toBe(200);
        expect(newUser.body.message).toBe("Inactive clickers' stats fetched successfully");
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'getInactiveClickersStats').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .get('/v1/clickers/stats/inactive-clickers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error fetching inactive clickers\' stats');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.getInactiveClickersStats.mockRestore();
    });
});