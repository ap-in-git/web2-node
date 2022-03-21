const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    quantity: {
        type: "Number",
        default: 1
    },
    price: {
        type: String,
        required: true
    },
    banner_image: {
        type: String,
        required: true
    },
    thumbnail_image: {
        type: String,
        required: true
    },
    shipping_cost: {
        type: "Number",
        required: true
    },
    product: {
        type: "Object",
    },
    id: {
        type: "String",
    }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
