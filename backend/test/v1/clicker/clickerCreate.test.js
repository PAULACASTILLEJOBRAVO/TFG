const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const Clicker = require('../../../src/models/Clicker');
const clickerServices = require('../../../src/services/v1/clickerServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let admin, student, validClicker;
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
        email: 'student1@test.com',
        password: '547638',
        role: 'student',
        status: 'active'
    });

    validClicker = {
        deviceCode: '0x0012',
        status: 'assigned',
        assignedToUserId: student._id.toString(),
        adminId: admin._id
    };
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/clickers', () => {
    it('201 - should create a new clicker', async () => {
        const newClicker = await request(app)
            .post('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validClicker);
        
        expect(newClicker.statusCode).toBe(201);
        expect(newClicker.body.message).toBe('Clicker created successfully');

        const clicker = await Clicker.findOne({ deviceCode: validClicker.deviceCode });
        expect(clicker).not.toBeNull();
        expect(clicker.deviceCode).toBe(validClicker.deviceCode);
    });

    it('400 - should fail if body is missing', async () => {
        const response = await request(app)
            .post('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid clicker data. Body is required');
    });

    it('409 - should fail if deviceCode already exists', async () => {
        // First, create a clicker
        await Clicker.create(validClicker);

        // Try to create the same clicker again
        const response = await request(app)
            .post('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validClicker);

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('The clicker already exists');
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(clickerServices, 'createClicker').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .post('/v1/clickers')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validClicker);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error creating clicker');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        clickerServices.createClicker.mockRestore();
    });
});