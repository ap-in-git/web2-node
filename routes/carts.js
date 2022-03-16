const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Joi = require("joi");
const { use } = require("express/lib/router");

/* GET all carts */
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET 1 cart */
router.get("/:id", async (req, res) => {
  const cart = await Cart.findOne(
    { _id: req.params.id },
    "product_id quantity user_id"
  );
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }
  cart.id = cart._id;
  return res.send(cart);
});

router.post("/", async (req, res) => {
  const { product_id, quantity, user_id } = req.body;
  const data = req.body;

  const schema = Joi.object().keys({
    product_id: Joi.string().required(),
    quantity: Joi.string().required(),
    user_id: Joi.string().required(),
  });

  const validationResult = schema.validate(data);
  if (validationResult.error != null) {
    const m = validationResult.error.details.map((i) => {
      return {
        [i.path[0]]: i.message.replace(/['"]/g, ""),
      };
    });
    return res.status(422).json(m);
  }

  cart = new Cart({
    product_id: product_id,
    quantity: quantity,
    user_id: user_id,
  });
  await cart.save();
  return res.json({
    message: "Cart created successfully",
    cart,
  });
});

/* UPDATE cart by id */
router.put("/:id", async (req, res) => {
  const data = req.body;

  const schema = Joi.object().keys({
    product_id: Joi.string().required(),
    quantity: Joi.string().required(),
    user_id: Joi.string().required(),
  });

  const validationResult = schema.validate(data);

  if (validationResult.error != null) {
    const m = validationResult.error.details.map((i) => {
      return {
        [i.path[0]]: i.message.replace(/['"]/g, ""),
      };
    });
    return res.status(422).json(m);
  }

  try {
    await Cart.findByIdAndUpdate(req.params.id, {
      $set: validationResult.value,
    });
    return res.json({
      message: "Cart updated successfully",
    });
  } catch (e) {
    if (e.kind === "ObjectId") {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

/* Delete cart by id */
router.delete("/:id", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndRemove(req.params.id);
    if (!cart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }
    return res.send({
      message: "Cart deleted successfully",
    });
  } catch (e) {
    if (e.kind === "ObjectId" || e.name === "NotFound") {
      return res.status(404).send({
        message: "Cart not found",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
