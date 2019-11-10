// get instance of contract
var ecommerceStoreArtifact = require("../../build/contracts/EcommerceStore.json");
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:8545'))

web3.eth.net.getId().then(function (networkId) {
    const deployedNetwork = ecommerceStoreArtifact.networks[networkId];
    instance = new web3.eth.Contract(
        ecommerceStoreArtifact.abi,
        deployedNetwork.address,
    );
    setupProductEventListner(instance);
})


// connect to MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var productModel = require('./product');
mongoose.connect("mongodb://localhost:27017/dapp_new");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connectinon error'));


// get express server app instance
var express = require('express');
var app = express();

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});

app.get('/', function (req, res) {
    res.send("Hello, Ethereum!");
});



function setupProductEventListner(i) {
    i.events.NewProduct({
        fromBlock: 0
    }, (error, event) => {
        console.log(event.returnValues);
    })
}

function saveProduct(product) {
    ProductModel.findOne({
        'blockchainId': product._productId.toNumber()
    }, function (err, dbProduct) {
        if (dbProduct != null) {
            return;
        }

        var p = new ProductModel({
            name: product._name,
            blockchainId: product._productId,
            category: product._category,
            ipfsImageHash: product._imageLink,
            ipfsDescHash: product._descLink,
            startTime: product._startTime,
            price: product._price,
            condition: product._productCondition
        });

        p.save(function (error) {
            if (error) {
                console.log(error);
            } else {
                ProductModel.count({}, function (err, count) {
                    console.log("count is " + count);
                });
            }
        });
    })
}