const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/TodoApp");
mongoose.connect("mongodb://admin:admin@ds159459.mlab.com:59459/todoapp-2018");

module.exports = {mongoose};