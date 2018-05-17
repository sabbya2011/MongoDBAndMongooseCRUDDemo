const {SHA256} = require("crypto-js");

var message = "I am just a message";
var hash = SHA256(message).toString();

console.log(`Message is ${message}`);
console.log(`hash is ${hash}`);

var data = {
    id:3
};
var token = {
    data,
    hash:SHA256(JSON.stringify(data)+"saltedText").toString()
}
console.log(token.hash);