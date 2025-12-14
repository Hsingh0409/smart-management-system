import { Response } from 'express';
import { validationResult } from 'express-validator';
import Sweet from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public (or Protected - depending on requirements)
export const getSweets = async (req: AuthRequest, res: Response) => {
    try {
        const sweets = await Sweet.find().sort({ createdAt: -1 });
        res.status(200).json({ sweets });
    } catch (error: any) {
        console.error('Get sweets error:', error);
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Public
export const getSweet = async (req: AuthRequest, res: Response) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }

        res.status(200).json({ sweet });
    } catch (error: any) {
        console.error('Get sweet error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Public
export const searchSweets = async (req: AuthRequest, res: Response) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;

        const query: any = {};

        // Text search
        if (q) {
            query.$text = { $search: q as string };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice as string);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
        }

        const sweets = await Sweet.find(query).sort({ createdAt: -1 });

        res.status(200).json({ sweets });
    } catch (error: any) {
        console.error('Search sweets error:', error);
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Create new sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const createSweet = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: errors.array()[0].msg } });
        }

        const { name, category, price, quantity, description, imageUrl } = req.body;

        const sweet = await Sweet.create({
            name,
            category,
            price,
            quantity,
            description,
            imageUrl,
        });

        res.status(201).json({ sweet });
    } catch (error: any) {
        console.error('Create sweet error:', error);
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
export const updateSweet = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: errors.array()[0].msg } });
        }

        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }

        const { name, category, price, quantity, description, imageUrl } = req.body;

        sweet.name = name || sweet.name;
        sweet.category = category || sweet.category;
        sweet.price = price !== undefined ? price : sweet.price;
        sweet.quantity = quantity !== undefined ? quantity : sweet.quantity;
        sweet.description = description !== undefined ? description : sweet.description;
        sweet.imageUrl = imageUrl || sweet.imageUrl;

        await sweet.save();

        res.status(200).json({ sweet });
    } catch (error: any) {
        console.error('Update sweet error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = async (req: AuthRequest, res: Response) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }

        await sweet.deleteOne();

        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error: any) {
        console.error('Delete sweet error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
export const purchaseSweet = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: errors.array()[0].msg } });
        }

        const { quantity } = req.body;

        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }

        // Check if sweet is out of stock
        if (sweet.quantity === 0) {
            return res.status(400).json({
                error: { message: 'Sweet is out of stock' },
            });
        }

        // Check if requested quantity is available
        if (quantity > sweet.quantity) {
            return res.status(400).json({
                error: { message: `Insufficient stock. Only ${sweet.quantity} available` },
            });
        }

        // Decrease quantity
        sweet.quantity -= quantity;
        await sweet.save();

        res.status(200).json({
            sweet,
            message: `Sweet purchased successfully. ${quantity} items purchased`,
        });
    } catch (error: any) {
        console.error('Purchase sweet error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }
        res.status(500).json({ error: { message: 'Server error' } });
    }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
export const restockSweet = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: errors.array()[0].msg } });
        }

        const { quantity } = req.body;

        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }

        // Increase quantity
        sweet.quantity += quantity;
        await sweet.save();

        res.status(200).json({
            sweet,
            message: `Sweet restocked successfully. ${quantity} items added`,
        });
    } catch (error: any) {
        console.error('Restock sweet error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: { message: 'Sweet not found' },
            });
        }
        res.status(500).json({ error: { message: 'Server error' } });
    }
};
