// CORRECTION: Import without destructuring since the model is exported as default
const Product = require('../models/Product');

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: "Failed to fetch products." });
    }
};

// Get Product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: "Failed to fetch product." });
    }
};

// Create Product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { name, price, categoryId, stock, description, image } = req.body;

        if (!name || !price || !categoryId || stock === undefined) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // CORRECTION: Use category_id instead of categoryId to match model
        const newProduct = await Product.create({ 
            name, 
            price, 
            category_id: categoryId, 
            stock,
            description,
            image,
            user_id: req.user.id // Assuming req.user is set by auth middleware
        });
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: "Failed to create product." });
    }
};

// Update Product (Admin Only)
const updateProduct = async (req, res) => {
    try {
        const { name, price, categoryId, stock, description, image } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        // CORRECTION: Use category_id instead of categoryId to match model
        await product.update({ 
            name, 
            price, 
            category_id: categoryId, 
            stock,
            description,
            image 
        });
        
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: "Failed to update product." });
    }
};

// Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: "Failed to delete product." });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };