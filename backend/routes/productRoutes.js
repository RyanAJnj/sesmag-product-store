import express from 'express';
import { 
    createProduct, 
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // ✅ import auth middleware

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (require login)
router.post('/', authenticateToken, createProduct);    // ✅
router.put('/:id', authenticateToken, updateProduct);  // ✅
router.delete('/:id', authenticateToken, deleteProduct); // ✅

export default router;
