const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        minlength:1,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:"{VALUE} is not valid email"
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

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};
  

UserSchema.methods.generateAuthToken = function(){
    const user = this;
    const access = "auth";
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});
    return user.save().then(()=>token);
}

UserSchema.methods.removeToken = function(token){
    const user = this;
    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    })
}

UserSchema.statics.findByCredentials = function(email,password){
    const User = this;
    return User.findOne({email}).then(
        (user)=>{
            if(!user){
                return Promise.reject("User Not Found");
            }
            return new Promise((resolve,reject)=>{
                bcrypt.compare(password,user.password,(err,res)=>{
                    if(res){
                        resolve(user);
                    }else{
                        reject("User credential is not correct");
                    }
                })
            });
        }
    )
}

UserSchema.statics.findByToken = function(token){
    var User = this;
    try{
        const decoded = jwt.verify(token,'abc123');
        //this is working fine however there is another way to do that
        //return User.findById(decoded._id)
        return User.findOne({
            _id:decoded._id,
            'tokens.token':token,
            'tokens.access':'auth'
        })
    }catch(e){
        return Promise.reject("User Not Found");
    }
    
}

UserSchema.pre("save",function(next){
    var user = this;
    if(user.isModified("password")){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
});
const User = mongoose.model("User",UserSchema);

module.exports = {User};