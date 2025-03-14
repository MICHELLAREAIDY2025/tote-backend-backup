const Product = require('../models/Product');
const Category = require('../models/Category'); //  Import Category model

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
        const { name, price, category_id, stock, description, image } = req.body;

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        //  Check if category exists before updating
        if (category_id) {
            const categoryExists = await Category.findByPk(category_id);
            if (!categoryExists) return res.status(400).json({ error: 'Invalid category! Category does not exist.' });
        }

        await product.update({ name, price, category_id, stock, description, image });
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

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(' Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
