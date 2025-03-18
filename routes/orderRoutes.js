const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    checkout,
    getAllOrders,
    getOrderItems,
    cancelOrder,
    updateOrderItem,
    deleteOrderItem,
    updateOrder
} = require('../controllers/orderController');

const router = express.Router();

router.post('/checkout', protect, checkout);
router.get('/', protect, getAllOrders);
router.get('/:order_id/items', protect, getOrderItems);
router.delete('/:order_id', protect, cancelOrder);
router.put('/item/:order_item_id', protect, updateOrderItem);
router.delete('/:order_id/item/:order_item_id', protect, deleteOrderItem);
router.put('/:order_id', protect, updateOrder);

module.exports = router;
