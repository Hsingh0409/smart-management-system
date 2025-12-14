import mongoose from 'mongoose';
import Sweet, { ISweet } from '../models/Sweet';

describe('Sweet Model', () => {
    describe('Sweet Creation', () => {
        it('should create a valid sweet with all required fields', async () => {
            const sweetData = {
                name: 'Chocolate Truffle',
                category: 'Chocolate',
                price: 5.99,
                quantity: 100,
                description: 'Rich dark chocolate truffle',
                imageUrl: 'https://example.com/chocolate.jpg',
            };

            const sweet = await Sweet.create(sweetData);

            expect(sweet.name).toBe(sweetData.name);
            expect(sweet.category).toBe(sweetData.category);
            expect(sweet.price).toBe(sweetData.price);
            expect(sweet.quantity).toBe(sweetData.quantity);
            expect(sweet.description).toBe(sweetData.description);
            expect(sweet.imageUrl).toBe(sweetData.imageUrl);
            expect(sweet._id).toBeDefined();
            expect(sweet.createdAt).toBeDefined();
            expect(sweet.updatedAt).toBeDefined();
        });

        it('should create sweet without optional fields', async () => {
            const sweetData = {
                name: 'Vanilla Fudge',
                category: 'Fudge',
                price: 3.99,
                quantity: 50,
            };

            const sweet = await Sweet.create(sweetData);

            expect(sweet.name).toBe(sweetData.name);
            expect(sweet.description).toBe('');
            expect(sweet.imageUrl).toBe('');
        });
    });

    describe('Sweet Validation', () => {
        it('should fail when name is missing', async () => {
            const sweetData = {
                category: 'Chocolate',
                price: 5.99,
                quantity: 100,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should fail when category is missing', async () => {
            const sweetData = {
                name: 'Test Sweet',
                price: 5.99,
                quantity: 100,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should fail when price is missing', async () => {
            const sweetData = {
                name: 'Test Sweet',
                category: 'Chocolate',
                quantity: 100,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should fail when quantity is missing', async () => {
            const sweetData = {
                name: 'Test Sweet',
                category: 'Chocolate',
                price: 5.99,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should fail when price is negative', async () => {
            const sweetData = {
                name: 'Test Sweet',
                category: 'Chocolate',
                price: -5.99,
                quantity: 100,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should fail when quantity is negative', async () => {
            const sweetData = {
                name: 'Test Sweet',
                category: 'Chocolate',
                price: 5.99,
                quantity: -10,
            };

            await expect(Sweet.create(sweetData)).rejects.toThrow();
        });

        it('should trim name whitespace', async () => {
            const sweetData = {
                name: '  Chocolate Bar  ',
                category: 'Chocolate',
                price: 2.99,
                quantity: 50,
            };

            const sweet = await Sweet.create(sweetData);

            expect(sweet.name).toBe('Chocolate Bar');
        });
    });

    describe('Sweet Updates', () => {
        it('should allow updating sweet fields', async () => {
            const sweet = await Sweet.create({
                name: 'Original Sweet',
                category: 'Candy',
                price: 1.99,
                quantity: 100,
            });

            sweet.price = 2.99;
            sweet.quantity = 75;
            await sweet.save();

            const updatedSweet = await Sweet.findById(sweet._id);

            expect(updatedSweet?.price).toBe(2.99);
            expect(updatedSweet?.quantity).toBe(75);
        });
    });
});
