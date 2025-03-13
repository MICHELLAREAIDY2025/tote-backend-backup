const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes (No authentication required)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-Only Routes
// First protect the route, then check if user is admin
router.post('/', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.createProduct);
router.put('/:id', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.deleteProduct);

module.exports = router;