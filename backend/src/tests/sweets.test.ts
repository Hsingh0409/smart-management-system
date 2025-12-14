import request from 'supertest';
import app from '../server';
import User from '../models/User';
import Sweet from '../models/Sweet';
import jwt, { SignOptions } from 'jsonwebtoken';

describe('Sweets CRUD API', () => {
    let adminToken: string;
    let userToken: string;
    let testSweet: any;

    beforeEach(async () => {
        // Create admin and regular user
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });

        const user = await User.create({
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
        });

        // Generate tokens
        adminToken = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' } as SignOptions
        );

        userToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' } as SignOptions
        );

        // Create test sweet
        testSweet = await Sweet.create({
            name: 'Test Chocolate',
            category: 'Chocolate',
            price: 5.99,
            quantity: 100,
            description: 'Delicious chocolate',
            imageUrl: 'https://example.com/chocolate.jpg',
        });
    });

    describe('POST /api/sweets', () => {
        it('should create new sweet as admin', async () => {
            const sweetData = {
                name: 'New Sweet',
                category: 'Candy',
                price: 2.99,
                quantity: 50,
                description: 'A new sweet',
                imageUrl: 'https://example.com/sweet.jpg',
            };

            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(201);

            expect(response.body).toHaveProperty('sweet');
            expect(response.body.sweet.name).toBe(sweetData.name);
            expect(response.body.sweet.price).toBe(sweetData.price);
        });

        it('should reject creation by non-admin user', async () => {
            const sweetData = {
                name: 'New Sweet',
                category: 'Candy',
                price: 2.99,
                quantity: 50,
            };

            await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send(sweetData)
                .expect(403);
        });

        it('should reject creation without authentication', async () => {
            const sweetData = {
                name: 'New Sweet',
                category: 'Candy',
                price: 2.99,
                quantity: 50,
            };

            await request(app)
                .post('/api/sweets')
                .send(sweetData)
                .expect(401);
        });

        it('should fail when name is missing', async () => {
            const sweetData = {
                category: 'Candy',
                price: 2.99,
                quantity: 50,
            };

            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should fail when price is negative', async () => {
            const sweetData = {
                name: 'Test',
                category: 'Candy',
                price: -5.99,
                quantity: 50,
            };

            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/sweets', () => {
        it('should get all sweets with authentication', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('sweets');
            expect(Array.isArray(response.body.sweets)).toBe(true);
            expect(response.body.sweets.length).toBeGreaterThan(0);
        });

        it('should reject without authentication', async () => {
            await request(app)
                .get('/api/sweets')
                .expect(401);
        });
    });

    describe('GET /api/sweets/:id', () => {
        it('should get single sweet by id', async () => {
            const response = await request(app)
                .get(`/api/sweets/${testSweet._id}`)
                .expect(200);

            expect(response.body).toHaveProperty('sweet');
            expect(response.body.sweet.name).toBe(testSweet.name);
        });

        it('should return 404 for non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            await request(app)
                .get(`/api/sweets/${fakeId}`)
                .expect(404);
        });

        it('should return 404 for invalid id format', async () => {
            await request(app)
                .get('/api/sweets/invalid-id')
                .expect(404);
        });
    });

    describe('GET /api/sweets/search', () => {
        beforeEach(async () => {
            // Create more sweets for search testing
            await Sweet.create([
                {
                    name: 'Dark Chocolate Bar',
                    category: 'Chocolate',
                    price: 3.99,
                    quantity: 75,
                },
                {
                    name: 'Vanilla Fudge',
                    category: 'Fudge',
                    price: 4.99,
                    quantity: 50,
                },
                {
                    name: 'Milk Chocolate',
                    category: 'Chocolate',
                    price: 2.99,
                    quantity: 100,
                },
            ]);
        });

        it('should search sweets by text query', async () => {
            const response = await request(app)
                .get('/api/sweets/search?q=chocolate')
                .expect(200);

            expect(response.body).toHaveProperty('sweets');
            expect(response.body.sweets.length).toBeGreaterThan(0);
        });

        it('should filter sweets by category', async () => {
            const response = await request(app)
                .get('/api/sweets/search?category=Chocolate')
                .expect(200);

            expect(response.body).toHaveProperty('sweets');
            response.body.sweets.forEach((sweet: any) => {
                expect(sweet.category).toBe('Chocolate');
            });
        });

        it('should filter sweets by price range', async () => {
            const response = await request(app)
                .get('/api/sweets/search?minPrice=3&maxPrice=5')
                .expect(200);

            expect(response.body).toHaveProperty('sweets');
            response.body.sweets.forEach((sweet: any) => {
                expect(sweet.price).toBeGreaterThanOrEqual(3);
                expect(sweet.price).toBeLessThanOrEqual(5);
            });
        });

        it('should combine multiple search filters', async () => {
            const response = await request(app)
                .get('/api/sweets/search?category=Chocolate&minPrice=3')
                .expect(200);

            expect(response.body).toHaveProperty('sweets');
            response.body.sweets.forEach((sweet: any) => {
                expect(sweet.category).toBe('Chocolate');
                expect(sweet.price).toBeGreaterThanOrEqual(3);
            });
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should update sweet as admin', async () => {
            const updates = {
                name: 'Updated Sweet',
                price: 6.99,
                quantity: 75,
            };

            const response = await request(app)
                .put(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates)
                .expect(200);

            expect(response.body.sweet.name).toBe(updates.name);
            expect(response.body.sweet.price).toBe(updates.price);
            expect(response.body.sweet.quantity).toBe(updates.quantity);
        });

        it('should reject update by non-admin user', async () => {
            const updates = {
                name: 'Updated Sweet',
                price: 6.99,
            };

            await request(app)
                .put(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updates)
                .expect(403);
        });

        it('should return 404 for non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            await request(app)
                .put(`/api/sweets/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Test' })
                .expect(404);
        });

        it('should fail validation with invalid data', async () => {
            const updates = {
                name: 'Test',
                price: -10,
            };

            await request(app)
                .put(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates)
                .expect(400);
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should delete sweet as admin', async () => {
            const response = await request(app)
                .delete(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');

            // Verify sweet is deleted
            const deleted = await Sweet.findById(testSweet._id);
            expect(deleted).toBeNull();
        });

        it('should reject deletion by non-admin user', async () => {
            await request(app)
                .delete(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
        });

        it('should return 404 for non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            await request(app)
                .delete(`/api/sweets/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });
});
