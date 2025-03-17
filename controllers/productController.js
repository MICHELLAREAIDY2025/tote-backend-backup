const Product = require('../models/Product');
const Category = require('../models/Category'); //  Import Category model
const path = require('path'); 
const fs = require('fs'); 

//  Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: { model: Category, attributes: ['name'] } });
        res.status(200).json(products);
    } catch (error) {
        console.error(' Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

//  Get Product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: { model: Category, attributes: ['name'] } });
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        res.status(200).json(product);
    } catch (error) {
        console.error(' Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product.' });
    }
};

//  Create Product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { name, price, category_id, stock, description, image } = req.body;

        //  Check if category exists before creating product
        const categoryExists = await Category.findByPk(category_id);
        if (!categoryExists) return res.status(400).json({ error: 'Invalid category! Category does not exist.' });

        const newProduct = await Product.create({ name, price, category_id, stock, description, image });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(' Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product.' });
    }
};

//  Update Product (Admin Only)
const updateProduct = async (req, res) => {
    try {
        const { name, price, category_id, stock, description } = req.body;

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        //  Check if category exists before updating
        if (category_id) {
            const categoryExists = await Category.findByPk(category_id);
            if (!categoryExists) return res.status(400).json({ error: 'Invalid category! Category does not exist.' });
        }
 // Handle image update
 let imageUrl = product.image; // Keep existing image by default
 if (req.file) {
     // If there's a new file, update the image URL
     imageUrl = `/uploads/products/${req.file.filename}`;
     
     // Optionally: Delete the old image file if it exists
     if (product.image) {
         const oldImagePath = path.join(__dirname, '..', product.image);
         if (fs.existsSync(oldImagePath)) {
             fs.unlinkSync(oldImagePath);
         }
     }
 }
await product.update({ 
     name, 
     price, 
     category_id, 
     stock, 
     description, 
     image: imageUrl 
 });
        res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

//  Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        // Delete the image file if it exists
        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(' Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, stock, user_id } = req.body;
        
        if (!name || !price || !category_id || !stock || !user_id) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Get the file path from multer - fix the path to match your storage destination
        const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

        const product = await Product.create({
            name,
            description,
            price,
            category_id,
            stock,
            image: imageUrl,
            user_id
        });

        res.status(201).json({ message: 'Product added successfully!', product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { addProduct, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
