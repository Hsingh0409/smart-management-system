import request from 'supertest';
import app from '../server';
import User from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';

describe('Auth Middleware', () => {
    let userToken: string;
    let adminToken: string;

    beforeEach(async () => {
        // Create regular user
        const user = await User.create({
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
        });

        // Create admin user
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });

        // Generate tokens
        userToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' } as SignOptions
        );

        adminToken = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' } as SignOptions
        );
    });

    describe('Authentication Required', () => {
        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .expect(401);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error.message).toContain('token');
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', 'Bearer invalid-token-12345')
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });

        it('should reject request with malformed authorization header', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });

        it('should accept request with valid token', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            // Should not be 401
            expect(response.status).not.toBe(401);
        });
    });

    describe('Admin Authorization', () => {
        it('should reject non-admin user from admin routes', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Test Sweet',
                    category: 'Candy',
                    price: 2.99,
                    quantity: 50,
                })
                .expect(403);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error.message).toContain('Admin');
        });

        it('should allow admin user to access admin routes', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Admin Sweet',
                    category: 'Candy',
                    price: 2.99,
                    quantity: 50,
                });

            // Should not be 403
            expect(response.status).not.toBe(403);
        });
    });

    describe('Token Expiration', () => {
        it('should reject expired token', async () => {
            // Create expired token
            const expiredToken = jwt.sign(
                { id: 'test-id' },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '0s' } as SignOptions
            );

            // Wait a bit to ensure it's expired
            await new Promise(resolve => setTimeout(resolve, 100));

            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });
});
