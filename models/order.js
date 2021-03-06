const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: {
    type: 'String',
  },
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: 'Number',
    default: 1,
  },

  user_id: {
    type: String,
    required: true,
  },
  shipping_cost: {
    type: 'Number',
    required: true,
  },
  product_price: {
    type: 'String',
    required: true,
  },
  order_status: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
