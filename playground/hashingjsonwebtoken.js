const jwt = require("jsonwebtoken");

const data = {
    id:10
};

const token = jwt.sign(data,"123abc");
console.log(`token : ${token}`);

const decoded = jwt.verify(token,"123abc");
console.log(`decoded : ${JSON.stringify(decoded,undefined,2)}`);