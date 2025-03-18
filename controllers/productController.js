const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path'); 
const fs = require('fs'); 

//  Get All Products (Public)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ 
            include: { model: Category, attributes: ['name'] } 
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

//  Get Product by ID (Public)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { 
            include: { model: Category, attributes: ['name'] } 
        });
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product.' });
    }
};

// Add Product (Admin Only)
const addProduct = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging
        console.log("Uploaded Files:", req.files); // Debugging

        const { name, description, price, category_id, stock } = req.body;
        const user_id = req.user.id;

        if (!name || !price || !category_id || !stock) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const imagePaths = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

        const product = await Product.create({
            name,
            description,
            price,
            category_id,
            stock,
            image: JSON.stringify(imagePaths),
            user_id
        });

        res.status(201).json({ message: 'Product added successfully!', product });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Update Product (Admin Only)
const updateProduct = async (req, res) => {
    try {
        const { name, price, category_id, stock, description, deleteImages } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        let imagePaths = JSON.parse(product.image || '[]');

        // Delete selected images (if provided)
        if (deleteImages) {
            const imagesToDelete = JSON.parse(deleteImages);
            imagePaths = imagePaths.filter(image => !imagesToDelete.includes(image));

            // Remove images from storage
            imagesToDelete.forEach(image => {
                const imagePath = path.join(__dirname, '..', image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Add new images (if uploaded)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            imagePaths = [...imagePaths, ...newImages];
        }

        // Update product in database
        await product.update({ 
            name, 
            price, 
            category_id, 
            stock, 
            description, 
            image: JSON.stringify(imagePaths)
        });

        res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

// Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        // Remove images from storage
        const imagePaths = JSON.parse(product.image || '[]');
        imagePaths.forEach(image => {
            const imagePath = path.join(__dirname, '..', image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};

module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };