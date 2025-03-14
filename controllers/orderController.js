const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.checkout = async (req, res) => {
    try {
        const user_id = req.user.id;
        const cartItems = await Cart.findAll({ where: { user_id } });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let total_price = 0;

        for (let item of cartItems) {
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.product_id} not found` });
            }
            total_price += product.price * item.quantity;
        }

        const order = await Order.create({ user_id, total_price, status: 'pending' });

        for (let item of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity
            });
        }

        await Cart.destroy({ where: { user_id } });

        return res.status(201).json({ message: 'Order placed successfully', order_id: order.id });
    } catch (error) {
        console.error(' Checkout Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orders = await Order.findAll();
        return res.status(200).json(orders);
    } catch (error) {
        console.error(' Get Orders Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
