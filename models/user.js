const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const saltRounds = 10

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true
    },
    shipping_address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    purchaseHistory: {
        type: Array,
    },
    id: {
        type: String,
    }
});


//For hasing the user
UserSchema.pre("save",  function (next){
    const user = this
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }

                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
