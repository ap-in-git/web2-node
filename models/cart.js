const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
