// init mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// define schema with using mongoose
var ProductSchema = new Schema({
    blockchainId: Number,
    name: String,
    category: String,
    ipfsImageHash: String,
    ipfsDescHash: String,
    startTime: Number,
    price: Number,
    condition: Number,
    buyer: String,
    seller: String,
    destination: String,
    phoneNumber: String,
});

// make a collection
var ProductModel = mongoose.model('ProductModel', ProductSchema);

module.exports = ProductModel;
