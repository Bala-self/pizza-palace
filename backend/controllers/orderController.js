const Order = require('../models/Order');
const Pizza = require('../models/pizza');

// ── Place Order ─────────────────────────────────────────
const placeOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add items before placing an order.'
      });
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a delivery address.'
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizzaId);

      if (!pizza) {
        return res.status(404).json({
          success: false,
          message: 'Pizza not found. It may have been removed.'
        });
      }

      if (!pizza.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${pizza.name}" is currently unavailable.`
        });
      }

      orderItems.push({
        pizza: pizza._id,
        qty:   item.qty,
        price: pizza.price,
        name:  pizza.name
      });

      totalAmount += pizza.price * item.qty;
    }



    // ---------------------------------- for loop ends here

    const order = await Order.create({
      customerId:      req.user.id,
      items:           orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      status:          'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });

  } catch (error) {
    next(error);
  }
};

//--------------------------------Get My Orders ───────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count:   orders.length,
      orders
    });

  } catch (error) {
    next(error);
  }
};

// ── ------------------------------------Get All Orders (Admin) ──────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count:   orders.length,
      orders
    });

  } catch (error) {
    next(error);
  }
};

// ──------------------------------ Update Order Status (Admin) ─────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order
    });

  } catch (error) {
    next(error);
  }
};

// ──----------------------- Cancel Order ────────────────────────────────────────
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (req.user.role !== 'admin' &&
        order.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders.'
      });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already "${order.status}".`
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};