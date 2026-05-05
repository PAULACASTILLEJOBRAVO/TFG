const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Clicker = require('../../../src/models/Clicker');
const clickerServices = require('../../../src/services/v1/clickerServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let userAdmin, user, userId, clicker, clickerId;
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
        username: 'student1',
        email: 'student1@test.com',
        password: '987654',
        role: 'student',
        status: 'active'
    });

    clicker = await Clicker.create({
        deviceCode: '0x0012',
        status: 'assigned',
        assignedToUserId: user._id.toString(),
        adminId: userAdmin._id.toString()
    });

    clickerId = clicker._id.toString();
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('GET /v1/clickers', () => {

    it('200 - should return all clickers', async () => {
        const response = await request(app)
            .get('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Clickers fetched successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1); // 1 clicker created in beforeEach
    });

    it('401 - should fail without token', async () => {
        const response = await request(app)
            .get('/v1/clickers');

        expect(response.statusCode).toBe(401);
    });

    it('401 - should fail with invalid token', async () => {
        const response = await request(app)
            .get('/v1/clickers')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
    });

    it('500 - should return 500 if there is a server error', async () => {
        // Mock the service to throw an error
        jest.spyOn(clickerServices, 'getAllClickers').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Error fetching clickers');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Database error');

        // Restore the original implementation
        clickerServices.getAllClickers.mockRestore();
    });

});