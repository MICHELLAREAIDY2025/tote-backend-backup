const Product = require('../models/Product');

// Middleware to check if a product exists before updating or deleting
const checkProductExists = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    req.product = product; // Store the product in the request object
    next();
};

// Middleware to validate product data before creation or update
const validateProductData = (req, res, next) => {
    const { name, price, category_id, stock } = req.body;

    if (!name || !price || !category_id || !stock) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Invalid price value' });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: 'Stock must be a positive integer' });
    }

    next();
};

module.exports = { checkProductExists, validateProductData };
