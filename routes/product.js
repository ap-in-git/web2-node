const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require("../models/product");
const Joi = require("joi");
const path = require("path");

/* GET API to retrieve all the Products */
router.get("/", async (req, res) => {
    const BASE_URL=process.env.APP_URL
    try{
        const products = await Product.find({})
        products.forEach( p => {
            p.id = p._id
            p.banner_image = BASE_URL +"/banner_image/" + p.banner_image
            p.thumbnail_image = BASE_URL +"/thumbnail_image/"+ p.thumbnail_image

        })
        res.json(products)
    }catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

router.get('/:id', async (req, res) => {
    try{
       const product =  await Product.findById(req.params.id)
       product.id = product._id
        if (!product){
            return res.status(404).send({
                message:"Product not found"
            })
        }
        return res.json(product)
    }catch (e) {
        if (e.kind === 'ObjectId'){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        return res.status(500).json({
            message:"Product not found"
        })
    }
});

/* POST product */
router.post('/', async (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.string().required(),
        quantity: Joi.string().required(),
        shipping_cost: Joi.string()
    });
    const validationResult = schema.validate(data)
    if (validationResult.error != null) {
        const m = validationResult.error.details.map( i => {
            return {
                [i.path[0]]:  i.message.replace(/['"]/g, '')
            }

        })
        return  res.status(422).json(m)
    }
    if (!req.files){
        return res.status(422).json({
            message:"Image is required"
        })
    }

    try {
        const thumbnail_image = req.files.thumbnail_image;
        const thumbnail_extension = path.extname(thumbnail_image.name);
        const thumbnail_file_name = generateFileName() + thumbnail_extension;
        const banner_image = req.files.banner_image;
        const banner_extension = path.extname(banner_image.name);
        const banner_file_name = generateFileName() + banner_extension;
        await thumbnail_image.mv("./public/thumbnail_image/"+thumbnail_file_name)
        await banner_image.mv("./public/banner_image/"+banner_file_name)
        const {title,description,price,quantity,shipping_cost} = data;
        const product = new Product({
            title,
            description,
            price,
            quantity,
            shipping_cost,
            thumbnail_image: thumbnail_file_name,
            banner_image: banner_file_name
        })
       await product.save();
       return res.json({
           message:"Product created successfully",
           product
        })
    }catch (e) {
        res.status(500).json({
            "message":"Something went wrong",
        })
    }
});

/* Update product */
router.put('/:id', async (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.string().required(),
        quantity: Joi.string().required(),
        shipping_cost: Joi.string()
    });
    const validationResult = schema.validate(data)
    if (validationResult.error != null) {
        const m = validationResult.error.details.map( i => {
            return {
                [i.path[0]]:  i.message.replace(/['"]/g, '')
            }

        })
        return  res.status(422).json(m)
    }

    try {
        const {title,description,price,quantity,shipping_cost} = data;
        const product = await Product.findById(req.params.id)
        let thumbnail_file_name = product.thumbnail_image;
        if (req.files && req.files.thumbnail_image) {
            const thumbnail_image = req.files.thumbnail_image;
            const thumbnail_extension = path.extname(thumbnail_image.name);
            thumbnail_file_name = generateFileName() + thumbnail_extension;
            await thumbnail_image.mv("./public/thumbnail_image/"+thumbnail_file_name)
        }
        let banner_file_name = product.banner_image;
        if (req.files && req.files.banner_image){
            const banner_image = req.files.banner_image;
            const banner_extension = path.extname(banner_image.name);
             banner_file_name = generateFileName() + banner_extension;
            await banner_image.mv("./public/banner_image/"+banner_file_name)
        }
        await Product.findByIdAndUpdate(req.params.id,{
            $set:{
                title,
                description,
                price,
                quantity,
                shipping_cost,
                thumbnail_image: thumbnail_file_name,
                banner_image: banner_file_name
            }
        })

       return res.json({
           message:"Product updated successfully",
        })
    }catch (e) {
        res.status(500).json({
            "message":"Something went wrong",
        })
    }
});


/* DELETE product by id */
router.delete("/:id", async (req, res) => {
    try{
        const product=  await Product.findByIdAndRemove(req.params.id)
        if (!product){
            return   res.status(404).send({
                message:"No product found"
            })
        }
        return res.json({
            message:"Product deleted successfully"
        })
    }catch (e){
        if (e.kind === "ObjectId" || e.name === "NotFound"){
            return res.status(404).json({
                "message":"Product not found"
            })
        }

        return res.status(500).json({
            "message":"Internal server error"
        })
    }
});


/* UPDATE product by id */
const generateFileName = () => {
    let timestamp = new Date().toISOString().replace(/[-:.]/g,"");
    let random = ("" + Math.random()).substring(2, 8);
    return timestamp + random;
}

module.exports = router;
