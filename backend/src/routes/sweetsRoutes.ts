import { Router } from 'express';
import { body } from 'express-validator';
import {
    getSweets,
    getSweet,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
} from '../controllers/sweetsController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validation rules for create
const createSweetValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
];

// Validation rules for update (all fields optional)
const updateSweetValidation = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
];

// Validation rules for purchase/restock
const quantityValidation = [
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
];

// Public routes
router.get('/search', searchSweets);
router.get('/:id', getSweet);

// Protected routes (require authentication)
router.get('/', authMiddleware, getSweets);
router.post('/:id/purchase', authMiddleware, quantityValidation, purchaseSweet);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createSweetValidation, createSweet);
router.put('/:id', authMiddleware, adminMiddleware, updateSweetValidation, updateSweet);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSweet);
router.post('/:id/restock', authMiddleware, adminMiddleware, quantityValidation, restockSweet);

export default router;
