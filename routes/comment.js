const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../models/comment');
const Product = require('../models/product');
const Joi = require('joi');
const path = require('path');

/* GET API to retrieve Comment by Product Id*/
router.get('/:product_id', async (req, res) => {
  try {
    const product_id_filter = { user_id: req.body.product_id };
    const comment = await Comment.find(product_id_filter);

    if (!comment) {
      return res.status(404).send({
        message: 'Comment not found',
      });
    }
    comment_id = comment._id;
    return res.json(comment);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }
    return res.status(500).json({
      message: 'Comment not found',
    });
  }
});
/* DELETE Comment by id */
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if (!comment) {
      return res.status(404).send({
        message: 'No comment found',
      });
    }
    return res.json({
      message: 'Comment deleted successfully',
    });
  } catch (e) {
    if (e.kind === 'ObjectId' || e.name === 'NotFound') {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

//Post method to create new Comment
router.post('/', async (req, res) => {
  const { product_id, text, comment_image, rating, user_id } = req.body;
  const data = req.body;

  const schema = Joi.object().keys({
    product_id: Joi.string().required(),
    text: Joi.string().required(),
    user_id: Joi.string().required(),
    comment_image: Joi.string().required(),
    rating: Joi.string().required(),
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
  comment = new Comment({
    product_id: product_id,
    text: text,
    comment_image: comment_image,
    rating: rating,
    user_id: user_id,
  });
  await comment.save();
  return res.json({
    message: 'comment created successfully',
    comment,
  });
});
module.exports = router;
