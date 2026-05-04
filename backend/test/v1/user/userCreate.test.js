const request = require('supertest');
const app = require('../../../app'); 
const User = require('../../../src/models/User');
const userServices = require('../../../src/services/v1/userServices');

const { connect, closeDatabase, clearDatabase } = require('../setup');

// Before all tests, start an in-memory MongoDB instance
beforeAll(async () => { await connect(); });

// Variable to store the authentication token for protected routes
let admin, validUser, failUser, cases;
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

    validUser = {
        username: 'teststudent',
        email: 'teststudent@test.com',
        password: 'teststudent'
    };

    cases = [
        { username: 'teststudent', password: 'teststudent', email: '' }, // missing email
        { username: 'teststudent', email: 'teststudent@test.com', password: '' }, // missing password
        { email: 'teststudent', password: 'teststudent', username: '' }, // missing username
        { } // empty body
    ];

    failUser = {
        username: 'failuser',
        email: 'failuser@test.com',
        password: 'failuser'
    }
});

// After all tests, stop the in-memory MongoDB instance
afterAll(async () => { await closeDatabase(); });

describe('POST /v1/users', () => {
    it('201 - should create a new user', async () => {
        const newUser = await request(app)
            .post('/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validUser);
        
        expect(newUser.statusCode).toBe(201);
        expect(newUser.body.message).toBe('User created successfully');

        const user = await User.findOne({ email: validUser.email });
        expect(user).not.toBeNull();
        expect(user.email).toBe(validUser.email);
    });

    it('400 - should fail if email, username or password is missing', async () => {
        for (const body of cases) {    
            const response = await request(app)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(body);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Username, email and password are required');
        }
    });

    it('409 - should fail if email already exists', async () => {
        // First, create a user
        await User.create(validUser);

        // Try to create the same user again
        const response = await request(app)
            .post('/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validUser);

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('The user already exists');
    });

    it('500 - should return 500 if something goes wrong internally', async () => {

        jest.spyOn(userServices, 'createUser').mockImplementation(() => {
            throw new Error('Database failure');
        });

        const response = await request(app)
            .post('/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(failUser);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error creating user');
        expect(response.body.error).toBe('Database failure');

        // Restore the original implementation
        userServices.createUser.mockRestore();
    });

});