const express = require('express');
const router  = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');



const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

//---------------------ROUTES

router.post('/',           verifyToken,          placeOrder);
router.get('/my',          verifyToken,          getMyOrders);
router.get('/',            verifyToken, isAdmin,  getAllOrders);
router.put('/:id/status',  verifyToken, isAdmin,  updateOrderStatus);
router.delete('/:id',      verifyToken,          cancelOrder);


module.exports = router;

