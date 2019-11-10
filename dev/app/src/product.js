var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    blochChainId: Number,
    name: String,
    category: String,
    ipfsImageHash: String,
    ipfsDesHash: String,
    startTime: Number,
    price: Number,
    condition: Number,
    Buyer: String
});

var ProductModel = mongoose.model('ProductModel', ProductSchema);

module.exports = ProductModel;