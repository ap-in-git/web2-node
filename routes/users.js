const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Joi = require("joi")
const {use} = require("express/lib/router");

/* GET all users */
router.get("/", async (req, res) => {
    try{
        if (req.query.id !== undefined) {

            return
        }
        const users = await User.find({},"name username email phone shipping_address purchase_history")
        users.forEach(u=>{
            u.id = u._id
        })
        return res.send(users)
    }catch (e) {
        return res.send({
            "message":e.message
        })
    }
});
/* GET all users */
router.get("/:id", async (req, res) => {
    const user = await User.findOne({_id: req.params.id},"name username email phone shipping_address purchase_history")
    if (!user){
       return res.status(404).json({
           "message":"User not found"
       })
    }
    user.id = user._id
    return res.send(user)
    return
});


router.post("/", async (req, res) => {
    const {name, username, phone, shipping_address, email,password} = req.body;
    const data = req.body;

    const schema = Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        phone: Joi.string().required(),
        shipping_address: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    const validationResult = schema.validate(data);
    if (validationResult.error != null){
        const m = validationResult.error.details.map( i => {
            return {
                [i.path[0]]:  i.message.replace(/['"]/g, '')
            }

        })
       return  res.status(422).json(m)
    }
    let user = await User.findOne({email : email})
    if (user){
        res.status(400).json({
            "message":"User already exist"
        })
        return
    }
     user = new User({
        name:name,
        email:email,
        password:password,
         shipping_address:shipping_address,
         phone:phone,
         username:username
    })
    await user.save()
    return res.json({
        "message":"User created successfully",
        user
    })
});



/* UPDATE user by id */
router.put("/:id", async (req, res) => {
    const data = req.body;
    const {password} = data
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        phone: Joi.string().required(),
        shipping_address: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string()
    });

    const validationResult = schema.validate(data);

    if (validationResult.error != null){
        const m = validationResult.error.details.map( i => {
            return {
                [i.path[0]]:  i.message.replace(/['"]/g, '')
            }

        })
        return  res.status(422).json(m)
    }

    //We don't need to update password if it is not there
    if (password === ""){
        delete data.password;
    }

    try{
        await User.findByIdAndUpdate(req.params.id,{$set:validationResult.value})
        return res.json({
            message:"User updated successfully",
        })
    }catch (e) {
        if (e.kind === "ObjectId"){
            return res.status(404).send({
                message: "User not found",
            });
        }

        return res.status(500).send({
            message: "Something went wrong",
        });
    }

});
/* Delete user by id */
router.delete("/:id", async (req, res) => {
    try{
       const user =  await User.findByIdAndRemove(req.params.id)
        if (!user){
            return res.status(404).send({
                message:"No user is not found"
            })
        }
        return res.send({
            message:"User deleted successfully"
        })
    }catch (e) {
        if (e.kind === "ObjectId" || e.name === 'NotFound'){
            return res.status(404).send({
                message:"User not found"
            })
        }
        return res.status(500).json({
            message:"Internal server error"
        })
    }

});


module.exports = router;
