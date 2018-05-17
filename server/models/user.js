const {mongoose} = require("../db/mongoose");
const validator = require("validator");

const User = mongoose.model("User",{
    email:{
        type:String,
        minlength:1,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"{value} id not valid email"
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

module.exports = {User};