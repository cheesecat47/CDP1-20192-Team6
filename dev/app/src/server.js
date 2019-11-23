var ecommerceStoreArtifact = require("../../build/contracts/EcommerceStore.json");
var mongoose = require('mongoose');
var express = require('express');


// [contract initialize]
var Web3 = require('web3');
web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:8545'))
web3.eth.net.getId().then(function (networkId) {
    const deployedNetwork = ecommerceStoreArtifact.networks[networkId];
    instance = new web3.eth.Contract(
        ecommerceStoreArtifact.abi,
        deployedNetwork.address,
    );
    setupProductEventListener(instance);
    setupBuyEventListener(instance);
});

// [mongodb connection]
mongoose.Promise = global.Promise;
var ProductModel = require("./product");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error :'));
db.once('open', () => {console.log("connected to mongod server")});
mongoose.connect('mongodb://localhost:27017/EcommerceStore');

// [server start to monitoring the port 3000]
var app = express();

// Allow the request from origin
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, function () {
    console.log("Server listening on port 3000")
});

app.get('/', function (req, res) {
    res.send('hello. wolrd!')
});

app.get('/products', function(req,res){
    var query = {};
    if (req.query.id !== undefined){
        query['blockchainId'] = {$eq: req.query.id};
    }
    if (req.query.name !== undefined){
        query['name'] = {$eq: req.query.name};
    }
    if (req.query.category !== undefined){
        query['category'] = {$eq: req.query.category};
    }
    if (req.query.price !== undefined){
        query['price'] = {$eq: req.query.price};
    }
    if (req.query.condition !== undefined){
        query['condition'] = {$eq: req.query.condition};
    }
    if (req.query.seller !== undefined){
        query['seller'] = {$eq: req.query.seller};
    }
    if (req.query.buyer !== undefined){
        query['buyer'] = {$eq: req.query.buyer};
    }
    ProductModel.find(query, null, {sort: 'startTime'}, function(err, items){
        // console.log("The number of query result = " + items.length);
        res.send(items);
    });
});

app.get('/products/buy', function(req, res){
    console.log(req.query);
    ProductModel.findOneAndUpdate({blockchainId: req.query.id}, {$set: {destination : String(req.query.destination), phoneNumber: String(req.query.phoneNumber)}}, {new:true}, function(err,doc){
        if(err){
            console.log("Something wrong when update");
        }
        res.send(doc);
        console.log(doc + "is updated");
    });
})

// // API for num of products
// app.get('/products/length', function(req,res){
//     ProductModel.countDocuments({}, function(err,count){
//         res.send(count.toString());
//     });
// });


function setupProductEventListener(_instance) {
    _instance.events.NewProduct({
        fromBlock: 0
    }, (error, event) => {
        console.log(event.returnValues);
        saveProduct(event.returnValues);
    });
}

function setupBuyEventListener(_instance) {
    _instance.events.NewBuy({
        fromBlock: 0
    }, (error, event) => {
        console.log(event.returnValues);
        addBuyerToProduct(event.returnValues);
    });
}

function saveProduct(product) {
    ProductModel.findOne({
        "blockchainId": product._productId
    }, function (err, dbProduct) {
        if (dbProduct != null) { // check db already has the product
            return;
        }

        var p = new ProductModel({
            name: product._name,
            blockchainId: product._productId,
            ipfsImageHash: product._imageLink,
            ipfsDescHash: product._descLink,
            startTime: product._startTime,
            price: product._price,
            condition: product._productCondition,
            buyer: '0x0000000000000000000000000000000000000000',
            seller: product._seller,
            destination: 'destination',
            phoneNumber: 'phoneNumber'
        });

        p.save(function(error) { // save product to DB
            if (error) {
                console.log(error);
            } else {
                ProductModel.countDocuments({}, function(err,count){
                    console.log("count is " + count);
                });
            }
        });
    });
}

function addBuyerToProduct(buy) {
    ProductModel.findOneAndUpdate({blockchainId: buy._productId}, {$set: {buyer : buy._buyer}}, {new:true}, function(err,doc){
        if(err){
            console.log("Something wrong when update");
        }
        console.log(doc + "is updated");
    });
}