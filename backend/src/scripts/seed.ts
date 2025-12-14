import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Sweet from '../models/Sweet';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Sweet.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            email: '23bsc10066@cuchd.in',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✅ Admin user created: 23bsc10066@cuchd.in / admin123');

        // Create regular user
        await User.create({
            email: 'user@sweetshop.com',
            password: 'user123',
            role: 'user',
        });
        console.log('✅ Regular user created: user@sweetshop.com / user123');

        // Create sample sweets
        const sweets = [
            {
                name: 'Milk Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 50,
                description: 'Smooth and creamy milk chocolate',
                imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
            },
            {
                name: 'Gummy Bears',
                category: 'Gummy',
                price: 1.99,
                quantity: 100,
                description: 'Colorful fruity gummy bears',
                imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
            },
            {
                name: 'Lollipops',
                category: 'Lollipop',
                price: 0.99,
                quantity: 200,
                description: 'Classic swirl lollipops',
                imageUrl: 'https://images.unsplash.com/photo-1624378354834-c468d3c8e0b0?w=400',
            },
            {
                name: 'Caramel Chews',
                category: 'Caramel',
                price: 3.49,
                quantity: 75,
                description: 'Soft and chewy caramel candies',
                imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
            },
            {
                name: 'Dark Chocolate Truffles',
                category: 'Chocolate',
                price: 5.99,
                quantity: 30,
                description: 'Premium dark chocolate truffles',
                imageUrl: 'https://images.unsplash.com/photo-1548848722-6f00c2e2ba90?w=400',
            },
            {
                name: 'Sour Gummy Worms',
                category: 'Gummy',
                price: 2.49,
                quantity: 80,
                description: 'Tangy sour gummy worms',
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
            },
            {
                name: 'Peppermint Hard Candy',
                category: 'Hard Candy',
                price: 1.49,
                quantity: 150,
                description: 'Refreshing peppermint candies',
                imageUrl: 'https://images.unsplash.com/photo-1576958545827-0e67f27c5f6b?w=400',
            },
            {
                name: 'Toffee Brittle',
                category: 'Toffee',
                price: 4.49,
                quantity: 40,
                description: 'Crunchy butter toffee brittle',
                imageUrl: 'https://images.unsplash.com/photo-1587222086960-986f298987ea?w=400',
            },
        ];

        await Sweet.insertMany(sweets);
        console.log(`✅ Created ${sweets.length} sample sweets`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nYou can now login with:');
        console.log('  Admin: 23bsc10066@cuchd.in / admin123');
        console.log('  User:  user@sweetshop.com / user123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
