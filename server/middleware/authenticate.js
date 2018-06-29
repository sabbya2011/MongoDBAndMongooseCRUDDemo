const {User} = require("../models/user");

var authenticateUser = (req,res,next)=>{
    const token = req.header("x-auth");
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject("User not found");
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        return res.status(401).send(e);
    })
};

module.exports = {authenticateUser};