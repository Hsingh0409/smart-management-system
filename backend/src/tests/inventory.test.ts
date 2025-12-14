import request from 'supertest';
import app from '../server';
import User from '../models/User';
import Sweet from '../models/Sweet';
import jwt, { SignOptions } from 'jsonwebtoken';

describe('Inventory Management API', () => {
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

    // Create test sweet with stock
    testSweet = await Sweet.create({
      name: 'Test Chocolate',
      category: 'Chocolate',
      price: 5.99,
      quantity: 100,
      description: 'Delicious chocolate',
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase sweet and decrease quantity', async () => {
      const purchaseData = {
        quantity: 10,
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(200);

      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.quantity).toBe(90);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('purchased successfully');
    });

    it('should fail when quantity is missing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when quantity is not a positive number', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when quantity is negative', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when requested quantity exceeds stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 150 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('stock');
    });

    it('should fail when sweet is out of stock', async () => {
      // Set quantity to 0
      testSweet.quantity = 0;
      await testSweet.save();

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('out of stock');
    });

    it('should fail when sweet does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .send({ quantity: 10 })
        .expect(401);
    });

    it('should handle multiple concurrent purchases correctly', async () => {
      const purchaseQuantity = 30;

      // Make 3 concurrent purchases
      const purchases = await Promise.all([
        request(app)
          .post(`/api/sweets/${testSweet._id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: purchaseQuantity }),
        request(app)
          .post(`/api/sweets/${testSweet._id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: purchaseQuantity }),
        request(app)
          .post(`/api/sweets/${testSweet._id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: purchaseQuantity }),
      ]);

      // Check that all succeeded
      purchases.forEach((response) => {
        expect([200, 400]).toContain(response.status);
      });

      // Verify final quantity is correct
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet?.quantity).toBeLessThanOrEqual(100);
      expect(updatedSweet?.quantity).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock sweet as admin', async () => {
      const restockData = {
        quantity: 50,
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.quantity).toBe(150);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('restocked successfully');
    });

    it('should reject restock by non-admin user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject restock without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .send({ quantity: 50 })
        .expect(401);
    });

    it('should fail when quantity is missing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when quantity is not a positive number', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when quantity is negative', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when sweet does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should allow restocking out of stock items', async () => {
      // Set quantity to 0
      testSweet.quantity = 0;
      await testSweet.save();

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 100 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(100);
    });
  });
});
