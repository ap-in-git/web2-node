const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Joi = require('joi');
const path = require('path');

/* GET API to retrieve Order by user Id*/
router.get('/:user_id', async (req, res) => {
  try {
    const user_id_filter = { user_id: req.params.user_id };

    const order = await Order.find(user_id_filter);

    if (!order) {
      return res.status(404).send({
        message: 'Order not found',
      });
    }
    const order_id = order._id;
    return res.json(order);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    return res.status(500).json({
      message: 'Order not found',
    });
  }
});
/* DELETE order by id */
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) {
      return res.status(404).send({
        message: 'No Order found',
      });
    }
    return res.json({
      message: 'Order deleted successfully',
    });
  } catch (e) {
    if (e.kind === 'ObjectId' || e.name === 'NotFound') {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

//Post method to create new Order
router.post('/', async (req, res) => {
  const { product_id, quantity, user_id } = req.body;
  const data = req.body;
  const schema = Joi.object().keys({
    product_id: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    user_id: Joi.string().required(),
  });

  const validationResult = schema.validate(data);
  if (validationResult.error != null) {
    const m = validationResult.error.details.map((i) => {
      return {
        [i.path[0]]: i.message.replace(/['"]/g, ''),
      };
    });
    return res.status(422).json(m);
  }
  const product = await Product.findById(product_id);
  if (!product) {
    return res.status(404).send({
      message: 'Product not found with Id: ' + product_id,
    });
  }
  const user = await User.findById(user_id);
  if (!user) {
    return res.status(404).send({
      message: 'User not found with Id: ' + user_id,
    });
  }
  const order = new Order({
    product_id: product_id,
    quantity: quantity,
    user_id: user_id,
    shipping_cost: product.shipping_cost,
    product_price: product.price,
    order_status: 'CREATED',
    created_at: new Date().toUTCString(),
  });
  await order.save();
  return res.json({
    message: 'order created successfully',
    order,
  });
});

//Put method to update new Order
router.put('/', async (req, res) => {
  const { order_status } = req.body;
  const _id = req.query.id;
  const data = req.body;
  const schema = Joi.object().keys({
    order_status: Joi.string().required(),
  });


  const validationResult = schema.validate(data);
  if (validationResult.error != null) {
    const m = validationResult.error.details.map((i) => {
      return {
        [i.path[0]]: i.message.replace(/['"]/g, ''),
      };
    });
    return res.status(422).json(m);
  }
  if (_id == null || _id == '') {
    return res.status(422).json({ message: 'invalid id ' });
  }
  let order = await Order.findOne({_id:_id});
  if (!order) {
    return res.status(404).send({
      message: 'Order not found with Id: ' + _id,
    });
  }


  order.order_status = order_status
  await order.save();
  return res.json({
    message: 'order status updated successfully',
    order,
  });
});

module.exports = router;
