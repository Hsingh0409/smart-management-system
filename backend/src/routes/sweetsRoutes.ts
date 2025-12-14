import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSweets,
  getSweet,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
} from '../controllers/sweetsController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validation rules
const sweetValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

// Public routes
router.get('/search', searchSweets);
router.get('/:id', getSweet);

// Protected routes (require authentication)
router.get('/', authMiddleware, getSweets);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, sweetValidation, createSweet);
router.put('/:id', authMiddleware, adminMiddleware, sweetValidation, updateSweet);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSweet);

export default router;
