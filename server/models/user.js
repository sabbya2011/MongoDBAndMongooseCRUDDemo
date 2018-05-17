const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
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

UserSchema.methods.generateAuthToken = ()=>{
    const user = this;
    const access = "auth";
    const token = jwt.sign({_id:user.id.toString(),access},'abc123').toString();

    user.tokens.push({access,token});
    //user.tokens.concat([{access,token}]);
    return user.save().then(
        (res)=>{
            return token;
        }
    );
}

const User = mongoose.model("User",UserSchema);

module.exports = {User};