const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
       

        if (!product_id || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid product or quantity' });
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const user_id = req.user.id;
        let cartItem = await Cart.findOne({ where: { user_id, product_id } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({ user_id, product_id, quantity });
        }

        return res.status(200).json({ message: 'Product added to cart', cartItem });
    } catch (error) {
        console.error(' Add to Cart Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const cartItems = await Cart.findAll({ where: { user_id } });

        return res.status(200).json(cartItems);
    } catch (error) {
        console.error('Get Cart Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const cartItem = await Cart.findOne({ where: { user_id, product_id } });

        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        await cartItem.destroy();
        return res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
