const mongoose = require('mongoose');

//-------------------order schema data store structure 
 
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Customer is required']
    },

    items: [
      {
        pizza: {
          type:     mongoose.Schema.Types.ObjectId,
          ref:      'Pizza',
          required: true
        },
        qty: {
          type:     Number,
          required: true,
          min:      [1, 'Quantity must be at least 1']
        },
        price: {
          type:     Number,
          required: true
        },
        name: {
          type:     String,
          required: true
        }
      }
    ],

    totalAmount: {
      type:     Number,
      required: [true, 'Total amount is required'],
      min:      [0, 'Total cannot be negative']
    },

    status: {
      type:    String,
      enum:    ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'],
      default: 'Pending'
    },

    deliveryAddress: {
      type:     String,
      required: [true, 'Delivery address is required'],
      trim:     true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);