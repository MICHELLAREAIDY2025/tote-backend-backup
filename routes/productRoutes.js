const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//  Public Routes (Everyone can see products)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

//  Admin Routes (Only Admins can modify products)
router.post('/', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.createProduct);
router.put('/:id', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorizeAdmin, productController.deleteProduct);

module.exports = router;
