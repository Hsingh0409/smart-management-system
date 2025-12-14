import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a valid user with email, password, and role', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'user' as const,
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(user.password).toBeDefined();
      expect(user.role).toBe(userData.role);
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create user with default role as "user"', async () => {
      const userData = {
        email: 'default@example.com',
        password: 'hashedPassword123',
      };

      const user = await User.create(userData);

      expect(user.role).toBe('user');
    });

    it('should create admin user when role is specified', async () => {
      const userData = {
        email: 'admin@example.com',
        password: 'hashedPassword123',
        role: 'admin',
      };

      const user = await User.create(userData);

      expect(user.role).toBe('admin');
    });
  });

  describe('User Validation', () => {
    it('should fail when email is missing', async () => {
      const userData = {
        password: 'hashedPassword123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when password is missing', async () => {
      const userData = {
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when email is invalid format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'hashedPassword123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when email is not unique', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'hashedPassword123',
      };

      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should trim email whitespace', async () => {
      const userData = {
        email: '  test@example.com  ',
        password: 'hashedPassword123',
      };

      const user = await User.create(userData);

      expect(user.email).toBe('test@example.com');
    });

    it('should convert email to lowercase', async () => {
      const userData = {
        email: 'TEST@EXAMPLE.COM',
        password: 'hashedPassword123',
      };

      const user = await User.create(userData);

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('Password Comparison', () => {
    it('should have a method to compare passwords', async () => {
      const userData = {
        email: 'password@example.com',
        password: 'hashedPassword123',
      };

      const user = await User.create(userData);

      expect(typeof user.comparePassword).toBe('function');
    });
  });
});
