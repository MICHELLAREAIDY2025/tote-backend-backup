const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');



const router = express.Router();

//  Public Routes (Everyone can see products)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);




// Admin Routes (Only Admins can modify products)
// Route to create a product with an image
router.post('/', 
    authMiddleware.protect, 
    authMiddleware.authorizeAdmin, 
    upload.array('images', 10),  // ✅ Allow multiple images
    productController.addProduct
);

router.put('/:id', 
    authMiddleware.protect, 
    authMiddleware.authorizeAdmin, 
    upload.array('images', 10),  // ✅ Allow multiple image updates
    productController.updateProduct
);

router.delete('/:id', 
    authMiddleware.protect, 
    authMiddleware.authorizeAdmin, 
    productController.deleteProduct
);

module.exports = router;
